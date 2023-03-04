import { initTRPC } from "@trpc/server";
import { nodeTree } from "@veo-test/db";
import { z } from "zod";

const t = initTRPC.create();

const router = t.router;

const publicProcedure = t.procedure;

export const appRouter = router({
    getRoots: publicProcedure.query(() =>
    nodeTree.filter((node) => node.height === 0)),
    getChildOfNode: publicProcedure
    .input(z.number())
    .query(({ input }) => 
      nodeTree.filter((node) => node.parentNode === input)),
});

export type AppRouter = typeof appRouter;
