import db from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
            
        // const existingGameCategory = await db.game.findUnique({
        //     where: {
        //         game: body.game
        //     }
        // })
    } catch (error) {
        return NextResponse.json({ message: `${error}`}, { status: 500 })
    }
}