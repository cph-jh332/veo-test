import { TNodeTree } from '@veo-test/db';
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
    <ul>
      {data.map((node) => (
        <li key={node.id}>{node.name}</li>
      ))}
    </ul>
  );
}

export default App;
