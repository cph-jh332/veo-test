import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const router = t.router;

const publicProcedure = t.procedure;

export const appRouter = router({
    hello: publicProcedure.query(() => 'hello world')
});

export type AppRouter = typeof appRouter;
