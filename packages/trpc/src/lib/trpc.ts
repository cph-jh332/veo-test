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

const changeHeightOfChildren = (id: number) => {
    nodeTree.forEach((node) => {
        if (node.parentNode === id) {
            node.height = node.height + 1;
            changeHeightOfChildren(node.id);
        }
    });
}

export const changeParent = ({ id, newParentId }: {id: number, newParentId: number}) => {
    //change parent of node and update height of node and all its children recursively
    const node = nodeTree.find((node) => node.id === id);
    if (node) {
        node.parentNode = newParentId;
        const newParent = nodeTree.find((node) => node.id === newParentId);
        node.height = newParent ? newParent.height + 1 : 0;
        changeHeightOfChildren(node.id);
    }
}

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
    changeParent: publicProcedure
    .input(z.object({
      id: z.number(),
      newParentId: z.number(),
    }))
    .mutation(({ input }) => {
      changeParent(input);
      return getChildrenOfNode(input.newParentId);
    }),
});

export type AppRouter = typeof appRouter;
