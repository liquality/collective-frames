import { db, user } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newUser = await db
      .insert(user)
      .values({
        identifier: data.identifier,
        walletAddress: data.walletAddress,
      }) //TODO: validate / parse data
      .returning();

    return NextResponse.json(newUser[0]);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
