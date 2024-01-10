import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    
  try {
    const bodier = await req.json();

    await db.tournaments.create({
      data: {
        name: bodier.name, 
        game: bodier.game,
        platforms: bodier.platforms,
        gameCategoryId: bodier.gameCategoryId,
        tournament_type: "community tournament",
        entry: "4v4",
        max_teams: 64,
        enrolled: 0
      },
    });

    return NextResponse.json(
      {
        message: `Tournament Created ${bodier.name}`,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: `${error}` }, { status: 500 });
  }
}
