type TNode = {
    id: number;
    name: string;
    parentNode?: number,
    height: number,
}

export type TManagerNode = TNode & {
    department: string;
}

export type TDeveloperNode = TNode & {
    preferredLanguage: string;
}

export const nodeTree: (TManagerNode | TDeveloperNode)[] = [
    {
        id: 0,
        name: 'John',
        height: 0,
        department: 'IT',
    },
    {
        id: 1,
        name: 'Jane',
        height: 1,
        preferredLanguage: 'JavaScript',
        parentNode: 0,
    }
    ,
    {
        id: 2,
        name: 'Julia',
        height: 0,
        department: 'Marketing',
    }
]

export type TNodeTree = typeof nodeTree;
