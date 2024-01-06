"use client";

import { useSession } from "next-auth/react";

// import Header from "./components/HAeader";

export default function Home() {
  const { data: data, status } = useSession();

  console.log("user", data)

  if ( data?.user.role !== 'admin') return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <section>
        Welcome what would admin like to do? 
      </section>
    </main>
  )
}
