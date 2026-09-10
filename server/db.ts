import { and, desc, eq, gt, isNull, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, foreignNumbers, orders, proxies, tempEmailMessages, tempEmails, users, walletTransactions } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (['name', 'email', 'loginMethod'] as const).forEach(field => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (!Object.keys(updateSet).length) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getDashboardData(userId: number) {
  const db = await getDb();
  if (!db) return { proxies: [], tempEmails: [], numbers: [], orders: [], transactions: [] };
  try {
    const [proxyRows, emailRows, numberRows, orderRows, transactionRows] = await Promise.all([
      db.select().from(proxies).where(eq(proxies.userId, userId)).orderBy(desc(proxies.createdAt)),
      db.select().from(tempEmails).where(eq(tempEmails.userId, userId)).orderBy(desc(tempEmails.createdAt)),
      db.select().from(foreignNumbers).where(eq(foreignNumbers.userId, userId)).orderBy(desc(foreignNumbers.createdAt)),
      db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt)).limit(20),
      db.select().from(walletTransactions).where(eq(walletTransactions.userId, userId)).orderBy(desc(walletTransactions.createdAt)).limit(20),
    ]);
    return { proxies: proxyRows, tempEmails: emailRows, numbers: numberRows, orders: orderRows, transactions: transactionRows };
  } catch (error) {
    console.warn("[Database] Dashboard read unavailable; returning empty state:", error);
    return { proxies: [], tempEmails: [], numbers: [], orders: [], transactions: [] };
  }
}

export async function createOrder(userId: number, input: { productType: string; packageName: string; priceUsd: string }) {
  const db = await getDb(); if (!db) return undefined;
  const [created] = await db.insert(orders).values({ userId, productType: input.productType, packageName: input.packageName, priceUsd: input.priceUsd, status: "pending" }).$returningId();
  return created;
}

export async function createWalletTransaction(userId: number, input: { amountUsd: string; method: string }) {
  const db = await getDb(); if (!db) return undefined;
  const [created] = await db.insert(walletTransactions).values({ userId, type: "deposit", amountUsd: input.amountUsd, method: input.method, status: "pending" }).$returningId();
  return created;
}

export async function createTempEmail(userId: number, email: string) {
  const db = await getDb(); if (!db) return undefined;
  if (!(await hasActiveProxyPlan(userId))) throw new Error("Please buy plan");
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const [created] = await db.insert(tempEmails).values({ userId, email, expiresAt }).$returningId();
  return created;
}

export async function hasActiveProxyPlan(userId: number) {
  const db = await getDb();
  if (!db) return false;
  try {
    const [proxy] = await db.select({ id: proxies.id }).from(proxies).where(and(eq(proxies.userId, userId), eq(proxies.status, "active"), or(isNull(proxies.expiresAt), gt(proxies.expiresAt, new Date())))).limit(1);
    if (proxy) return true;
    const [paidOrder] = await db.select({ id: orders.id }).from(orders).where(and(eq(orders.userId, userId), eq(orders.productType, "proxy"), or(eq(orders.status, "paid"), eq(orders.status, "completed"), eq(orders.status, "active"), eq(orders.status, "success")))).limit(1);
    return Boolean(paidOrder);
  } catch (error) {
    console.warn("[Database] Proxy-plan check unavailable; denying temp-mail generation:", error);
    return false;
  }
}

export async function getTempEmailMessages(tempEmailId: number) {
  const db = await getDb(); if (!db) return [];
  return db.select().from(tempEmailMessages).where(eq(tempEmailMessages.tempEmailId, tempEmailId)).orderBy(desc(tempEmailMessages.createdAt));
}
