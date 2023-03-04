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

const getChildrenOfNode = (parentId: number) => nodeTree.filter((node) => node.parentNode === parentId);

export const appRouter = router({
    getRoots: publicProcedure.query(() =>
    nodeTree.filter((node) => node.height === 0)),
    getChildOfNode: publicProcedure
    .input(z.number())
    .query(({ input }) => 
      getChildrenOfNode(input)),
    addChild: publicProcedure
    .input(zodChildInput)
    .mutation(({ input }) => {
      //find parent node
      const parent = nodeTree.find((node) => node.id === input.parentNode);

      //create new base node
      const newBaseNode = {
        id: nodeTree.length,
        name: input.name,
        parentNode: input.parentNode,
        height: parent ? parent.height + 1 : 0,
      };

      //add new manager or developer node to the tree
      if (input.department) {
        const managerNode = newBaseNode as TManagerNode;
        managerNode.department = input.department;
        nodeTree.push(managerNode);
        return getChildrenOfNode(input.parentNode);
      } else if (input.prefferedLanguage) {
        const developerNode = newBaseNode as TDeveloperNode;
        developerNode.preferredLanguage = input.prefferedLanguage;
        nodeTree.push(developerNode);
        return getChildrenOfNode(input.parentNode);
      }

      throw new Error("Invalid input");
    }),
});

export type AppRouter = typeof appRouter;
