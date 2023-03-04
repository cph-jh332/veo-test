import { initTRPC } from "@trpc/server";
import { nodeTree, TDeveloperNode, TManagerNode } from "@veo-test/db";
import { z } from "zod";

const t = initTRPC.create();

const router = t.router;

const publicProcedure = t.procedure;

const zodChildInput = z.object({
      name: z.string(),
      parentNode: z.number(),
      prefferedLanguage: z.string().optional(),
      department: z.string().optional(),
})
    
export type TChildInput = z.infer<typeof zodChildInput>;

export const appRouter = router({
    getRoots: publicProcedure.query(() =>
    nodeTree.filter((node) => node.height === 0)),
    getChildOfNode: publicProcedure
    .input(z.number())
    .query(({ input }) => 
      nodeTree.filter((node) => node.parentNode === input)),
    addChild: publicProcedure
    .input(zodChildInput)
    .mutation(({ input }) => {
      //find parent node
      const parent = nodeTree.find((node) => node.id === input.parentNode);

      //create new base node
      const newNode = {
        id: nodeTree.length,
        name: input.name,
        parentNode: input.parentNode,
        height: parent ? parent.height + 1 : 0,
      };

      //add new manager or developer node to the tree
      if (input.department) {
        (newNode as TManagerNode).department = input.department;
        nodeTree.push(newNode as TManagerNode);
      } else if(input.prefferedLanguage) {
        (newNode as TDeveloperNode).preferredLanguage = input.prefferedLanguage;
        nodeTree.push(newNode as TDeveloperNode);
      }
    }),
});

export type AppRouter = typeof appRouter;
