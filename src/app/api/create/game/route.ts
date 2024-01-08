import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const existingGameCategory = await db.gameCategory.findUnique({
      where: {
        game: body.game,
      },
    });

    if (existingGameCategory) throw new Error('Sorry Game is already created');

    await db.gameCategory.create({
      data: {
        game: body.game,
        platforms: body.platforms,
      },
    });

    return NextResponse.json(
      {
        message: `Game Created ${body.game}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
