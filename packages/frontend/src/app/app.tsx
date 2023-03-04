import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import {
  isDeveloperNode,
  TDeveloperNode,
  TManagerNode,
  TNodeTree,
} from '@veo-test/db';
import { TChildInput } from '@veo-test/trpc';
import { useEffect, useMemo, useRef, useState } from 'react';
import trpcClient from './trpcClient';

export function App() {
  const [data, setData] = useState<TNodeTree>([]);

  const [createNode, setCreateNode] = useState({
    parentNode: 0,
    show: false,
  });

  useEffect(() => {
    trpcClient.getRoots.query().then((data) => {
      setData(data);
    });
  }, []);

  const addChild = (node: Omit<TChildInput, 'parentNode'>) => {
    trpcClient.addChild
      .mutate({ parentNode: createNode.parentNode, ...node })
      .then((data) => {
        setData((currentData) => [
          ...currentData,
          ...data.filter(
            (incommingNode) =>
              !currentData.some((node) => node.id === incommingNode.id)
          ),
        ]);
        setCreateNode({ show: false, parentNode: 0 });
      });
  };

  const toggleChildren = (parentNode: number) => {
    if (data.some((n) => n.parentNode === parentNode)) {
      setData((currentData) =>
        currentData.filter((n) => n.parentNode !== parentNode)
      );
    } else {
      trpcClient.getChildOfNode.query(parentNode).then((res) => {
        setData((currentData) => [...currentData, ...res]);
      });
    }
  };

  const openModal = (parentNode: number) => {
    setCreateNode({ show: true, parentNode: parentNode });
  };

  return (
    <div className="p-4">
      {data
        .filter((n) => n.height === 0)
        .map((node) => {
          return (
            <NodeRender
              key={node.id}
              nodeTree={data}
              node={node}
              creatNode={openModal}
              getChildNodes={toggleChildren}
            />
          );
        })}
      {createNode.show && (
        <CreateNodeModal
          onAdd={addChild}
          onClose={() => setCreateNode({ show: false, parentNode: 0 })}
        />
      )}
    </div>
  );
}

const NodeRender = ({
  nodeTree,
  node,
  creatNode,
  getChildNodes,
}: {
  nodeTree: TNodeTree;
  node: TManagerNode | TDeveloperNode;
  creatNode: (parentNode: number) => void;
  getChildNodes: (parentNode: number) => void;
}) => {
  const renderChildren = (parentNode: number) => {
    // get children of node
    const children = nodeTree.filter((n) => n.parentNode === parentNode);
    if (children.length > 0) {
      return children.map((child) => (
        <NodeRender
          key={child.id}
          nodeTree={nodeTree}
          node={child}
          creatNode={creatNode}
          getChildNodes={getChildNodes}
        />
      ));
    }
  };

  return (
    <div>
      <div className="flex items-center">
        <button onClick={() => getChildNodes(node.id)}>
          {nodeTree.some((n) => n.parentNode === node.id) ? (
            <FontAwesomeIcon accentHeight={32} icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon accentHeight={32} icon={faChevronRight} />
          )}
        </button>
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
      <div className="ml-8">{renderChildren(node.id)}</div>
    </div>
  );
};

const CreateNodeModal = ({
  onAdd,
  onClose,
}: {
  onAdd: (node: Omit<TChildInput, 'parentNode'>) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');
  const prefferedLanguage = useRef<string>();
  const department = useRef<string>();
  const [isManager, setIsManager] = useState(false);

  return (
    <div
      className="relative z-10"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
      <div className="fixed inset-0 z-12 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <form action="">
                <label htmlFor="nameInput">Name</label>
                <input
                  className="border border-gray-300 rounded-xl ml-2 px-2"
                  id="nameInput"
                  type="text"
                  onChange={(e) => {
                    setName(e.currentTarget.value);
                    department.current = undefined;
                    prefferedLanguage.current = undefined;
                  }}
                />
                <label className="ml-4" htmlFor="isManager">
                  Manager
                </label>
                <input
                  className="ml-2 mb-4"
                  type="checkbox"
                  id="isManager"
                  onChange={(e) => setIsManager(e.currentTarget.checked)}
                />
                <br />
                {isManager ? (
                  <>
                    <label htmlFor="department">Department</label>
                    <input
                      className="border border-gray-300 rounded-xl ml-2 px-2"
                      type="text"
                      id="department"
                      onChange={(e) => {
                        department.current = e.currentTarget.value;
                      }}
                    />
                  </>
                ) : (
                  <>
                    <label htmlFor="language">Preffered Language</label>
                    <input
                      className="border border-gray-300 rounded-xl ml-2 px-2"
                      type="text"
                      id="language"
                      onChange={(e) => {
                        prefferedLanguage.current = e.currentTarget.value;
                      }}
                    />
                  </>
                )}
              </form>
              <br />
              <div className="flex justify-end">
                <button className="" onClick={onClose}>
                  cancel
                </button>
                <button
                  className="bg-blue-500 rounded-sm text-white px-2 h-fit ml-4"
                  onClick={() =>
                    onAdd({
                      name,
                      prefferedLanguage: prefferedLanguage.current,
                      department: department.current,
                    })
                  }
                >
                  add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
