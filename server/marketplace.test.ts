import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const now = new Date();
  const user: AuthenticatedUser = {
    id: 987654,
    openId: "marketplace-test-user",
    email: "marketplace@example.com",
    name: "Marketplace Test",
    loginMethod: "test",
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("marketplace procedures", () => {
  it("rejects invalid order payloads before any write", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.orders.create({ productType: "", packageName: "", priceUsd: -1 })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });

  it("returns a stable empty dashboard shape for a new operator", async () => {
    const caller = appRouter.createCaller(createContext());
    const result = await caller.dashboard.summary();
    expect(result).toEqual({ proxies: [], tempEmails: [], numbers: [], orders: [], transactions: [] });
  });
});
