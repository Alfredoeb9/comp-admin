import db from '@/lib/db';
import { NextResponse } from 'next/server';
// import PocketBase from 'pocketbase';

export async function GET(request: Request) {
  //   const pb = new PocketBase('http://127.0.0.1:8090');
  try {
    const records = await db.gameCategory.findMany();
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return new Response('Could not fetch', { status: 500 });
  }
}
