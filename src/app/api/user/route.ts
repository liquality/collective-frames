import { db, user } from "@/db";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const req = await request.json();
    console.log(req, 'wats req??')
    const existingUser = await findUserByFid(req.fid)
    if (existingUser) {
      return NextResponse.json(existingUser);

    } else {
      const newUser = await db
        .insert(user)
        .values({
          fid: req.fid,
          signerUuid: req.signer_uuid,
          identifier: req.identifier,
          walletAddress: req.walletAddress,
        })
        .returning();
      return NextResponse.json(newUser[0]);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

const findUserByFid = async (userFid: number) => {
  const existingUser = await db.select().from(user).where(sql`fid = ${userFid}`);
  if (existingUser) return existingUser
  else return null
}
