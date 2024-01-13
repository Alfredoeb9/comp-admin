'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
// import {
//   JSXElementConstructor,
//   PromiseLikeOfReactNode,
//   ReactElement,
//   ReactNode,
//   ReactPortal,
//   useEffect,
//   useState,
// } from 'react';

export default function Home() {
  const { data: data, status } = useSession();
  // const [games, setGames] = useState<any>([]);
  // const [error, setError] = useState<any>(null);

  // const fetchData = async () => {
  //   try {
  //     const data = await fetch('/api/game-category');

  //     const response = await data.json();

  //     console.log('res', response);

  //     setGames(response);
  //   } catch (error) {
  //     console.log('error', error);
  //     setError(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  if (data?.user.role !== 'admin') return null;

  return (
    <main className='flex min-h-screen flex-col items-center gap-2 p-24'>
      <section>Welcome what would admin like to do?</section>

      <section>
        <button><Link href="/create/tournament">Create Tournament</Link></button>
        <br />
        <button><Link href="/create/game-category">Create New Game</Link></button>
        {/* <div>{error && error}</div> */}
      </section>
      
    </main>
  );
}
