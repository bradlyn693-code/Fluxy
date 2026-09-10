import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createOrder, createTempEmail, createWalletTransaction, getDashboardData, hasActiveProxyPlan } from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  dashboard: router({
    summary: protectedProcedure.query(async ({ ctx }) => getDashboardData(ctx.user.id)),
  }),
  orders: router({
    create: protectedProcedure.input(z.object({ productType: z.string().min(1), packageName: z.string().min(1), priceUsd: z.coerce.number().positive() })).mutation(async ({ ctx, input }) => createOrder(ctx.user.id, { ...input, priceUsd: input.priceUsd.toFixed(2) })),
  }),
  wallet: router({
    deposit: protectedProcedure.input(z.object({ amountUsd: z.coerce.number().positive(), method: z.string().min(1) })).mutation(async ({ ctx, input }) => createWalletTransaction(ctx.user.id, { ...input, amountUsd: input.amountUsd.toFixed(2) })),
  }),
  tempMail: router({
    planStatus: protectedProcedure.query(({ ctx }) => hasActiveProxyPlan(ctx.user.id)),
    create: protectedProcedure.input(z.object({ email: z.string().email() })).mutation(async ({ ctx, input }) => {
      if (!(await hasActiveProxyPlan(ctx.user.id))) throw new Error("Please buy plan");
      return createTempEmail(ctx.user.id, input.email);
    }),
  }),
});

export type AppRouter = typeof appRouter;
