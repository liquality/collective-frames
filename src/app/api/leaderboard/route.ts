import { db, user } from "@/db";
import { getFramesPerCollective } from "@/utils/leaderboard";
import { findUserByFid, getAddrByFid } from "@/utils/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {

        const framesPerCollective = await getFramesPerCollective()
        return NextResponse.json(framesPerCollective);

    }


    catch (error) {
        console.error(error);
        return NextResponse.json({ error }, { status: 500 });
    }
}

