import { db, user } from "@/db";
import { getAddrByFid } from "@/utils/helpers";
import { findUserByFid } from "@/utils/user";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req, 'wats req??', req.fid, 'reqFID')
    const existingUser = await findUserByFid(req.fid)
    console.log(existingUser, 'Existing user?')
    if (existingUser) {
      return NextResponse.json(existingUser);

    } else {
      const walletAddress = await getAddrByFid(req.fid)
      if (walletAddress) {

        const newUser = await db
          .insert(user)
          .values({
            fid: req.fid,
            signerUuid: req.signer_uuid,
            walletAddress: walletAddress,
          })
          .returning();
        console.log(newUser[0], 'new user of row')
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

