import db from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const records = await db.gameCategory.findMany();
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return new Response('Could not fetch', { status: 500 });
  }
}
