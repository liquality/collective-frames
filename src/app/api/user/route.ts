import { db, user } from "@/db";
import { findUserByFid, getAddrByFid } from "@/utils/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    const existingUser = await findUserByFid(req.fid)
    if (existingUser) {
      return NextResponse.json(existingUser);

    } else {
      const walletAddress = await getAddrByFid(req.fid)
      if (walletAddress) {

        const newUser = await db
          .insert(user)
          .values({
            fid: req.fid,
            walletAddress: walletAddress,
          })
          .returning();
        return NextResponse.json(newUser[0]);
      } else {
        throw Error("Could not find walletaddress for fid: " + req.fid)
      }

    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

