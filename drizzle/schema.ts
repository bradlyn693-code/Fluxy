import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  walletBalance: decimal("walletBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const profiles = mysqlTable("profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  fullName: text("fullName"),
  email: varchar("email", { length: 320 }),
  walletBalance: decimal("walletBalance", { precision: 12, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const proxies = mysqlTable("proxies", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  ip: varchar("ip", { length: 64 }).notNull(),
  port: int("port").notNull(),
  username: varchar("username", { length: 128 }),
  password: varchar("password", { length: 128 }),
  country: varchar("country", { length: 80 }).notNull(),
  type: varchar("type", { length: 30 }).notNull(),
  status: varchar("status", { length: 30 }).default("active").notNull(),
  expiresAt: timestamp("expiresAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tempEmails = mysqlTable("tempEmails", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  email: varchar("email", { length: 320 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tempEmailMessages = mysqlTable("tempEmailMessages", {
  id: int("id").autoincrement().primaryKey(),
  tempEmailId: int("tempEmailId").notNull().references(() => tempEmails.id),
  fromEmail: varchar("fromEmail", { length: 320 }),
  subject: text("subject"),
  body: text("body"),
  otpCode: varchar("otpCode", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const foreignNumbers = mysqlTable("foreignNumbers", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").references(() => users.id),
  phoneNumber: varchar("phoneNumber", { length: 40 }).notNull(),
  country: varchar("country", { length: 80 }).notNull(),
  service: varchar("service", { length: 50 }).notNull(),
  otpCode: varchar("otpCode", { length: 16 }),
  status: varchar("status", { length: 30 }).default("waiting").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  productType: varchar("productType", { length: 40 }).notNull(),
  packageName: varchar("packageName", { length: 120 }).notNull(),
  priceUsd: decimal("priceUsd", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 30 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const walletTransactions = mysqlTable("walletTransactions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  type: varchar("type", { length: 30 }).notNull(),
  amountUsd: decimal("amountUsd", { precision: 12, scale: 2 }).notNull(),
  method: varchar("method", { length: 40 }),
  status: varchar("status", { length: 30 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type Proxy = typeof proxies.$inferSelect;
export type TempEmail = typeof tempEmails.$inferSelect;
export type ForeignNumber = typeof foreignNumbers.$inferSelect;
export type WalletTransaction = typeof walletTransactions.$inferSelect;
