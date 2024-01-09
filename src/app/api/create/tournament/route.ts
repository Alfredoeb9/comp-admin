import db from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    
  try {
    // console.log("body", await req.json())
    const bodier = await req.json();

    console.log("bodier", bodier)
    

    // const existingGameCategory = await db.tournaments.findU

    // if (existingGameCategory) throw new Error('Sorry Game is already created');

    // const newGame = {
    //     gameCategoryId: arrById[0]?.id,
    //     game: title,
    //     name: arrById[0]?.id,
    //     platforms: selected,
    // };

    // await db.tournaments.create({
    //     data: {
    //         ...bodier
    //     }
    // })

    await db.tournaments.create({
      data: {
        name: bodier.name, 
        game: bodier.game,
        platforms: bodier.platforms,
        gameCategoryId: bodier.gameCategoryId
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
