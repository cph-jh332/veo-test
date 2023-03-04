import {
  isDeveloperNode,
  TDeveloperNode,
  TManagerNode,
  TNodeTree,
} from '@veo-test/db';
import { useEffect, useState } from 'react';
import trpcClient from './trpcClient';

export function App() {
  const [data, setData] = useState<TNodeTree>([]);

  useEffect(() => {
    trpcClient.getRoots.query().then((data) => {
      setData(data);
    });
  }, []);

  return (
    <div>
      {data.map((node) => {
        return (
          <NodeRender
            node={node}
            creatNode={() => null}
            getChildNodes={() => null}
          />
        );
      })}
    </div>
  );
}

const NodeRender = ({
  node,
  creatNode,
  getChildNodes,
}: {
  node: TManagerNode | TDeveloperNode;
  creatNode: (parentNode: number) => void;
  getChildNodes: (parentNode: number) => void;
}) => {
  return (
    <div className="flex items-center">
      <button onClick={() => getChildNodes(node.id)}>&#8964;</button>
      <div className="flex items-center mb-2 ml-2 bg-gray-200 p-2 w-fit">
        <div>
          <div className="font-semibold flex">
            <p>{node.name}</p>
            <p className="ml-2 text-sm font-normal rounded-xl bg-green-300 px-2">
              {isDeveloperNode(node) ? 'developer' : 'manager'}
            </p>
          </div>
          <div className="text-sm text-gray-600">
            {isDeveloperNode(node)
              ? `Prefers writing in ${node.preferredLanguage}`
              : `Manages ${node.department}`}
          </div>
        </div>
        <button
          onClick={() => creatNode(node.id)}
          className="ml-4 bg-blue-500 rounded-xl text-sm text-white px-2 h-fit"
        >
          add child
        </button>
      </div>
    </div>
  );
};

export default App;
