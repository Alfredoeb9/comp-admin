'use client';

import { useSession } from 'next-auth/react';
import {
  JSXElementConstructor,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useState,
} from 'react';

export default function Home() {
  const { data: data, status } = useSession();
  const [games, setGames] = useState<any>([]);
  const [error, setError] = useState<any>(null);

  const fetchData = async () => {
    try {
      const data = await fetch('/api/game-category');

      const response = await data.json();

      console.log('res', response);

      setGames(response);
    } catch (error) {
      console.log('error', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (data?.user.role !== 'admin') return null;

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <section>Welcome what would admin like to do?</section>

      {games.map(
        (
          game: {
            game:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | PromiseLikeOfReactNode
              | null
              | undefined;
          },
          i: any
        ) => (
          <div key={i}>{game.game}</div>
        )
      )}
      <div>{error && error}</div>
    </main>
  );
}
