export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, collective } from "@/db";
import { ERC20_MINTER_ADDRESS, SUPPORTED_COMMUNITIES } from "@/utils/constants";
import { sql } from "drizzle-orm";
import { createCollective, createHoneyPot, createPool, distributeRewards, generateSalt, sendRewardToTopCollective, setTopCollective, withdrawRewards } from "@/utils/collective";
import { ethers } from "ethers";

export async function GET() {

  const res = await db.select().from(collective).where(sql`${collective.expiresAt} > CURRENT_TIMESTAMP`);
  return Response.json(res);

  // const SUPPORTED_COMMUNITIES = ["DEGEN", "HPOS10", "MFERS"]
  //  try {
  //    for (const community of SUPPORTED_COMMUNITIES) {
      // const honeyPot = await createHoneyPot(generateSalt())

  //      // Deploy a new collective and pool for each channel
  //      const cMetadata = await createCollective()
  //      const cPool = await createPool(cMetadata.address, ERC20_MINTER_ADDRESS, honeyPot)
 
        // console.log(honeyPot, ' << honeyPot')
  //      console.log(cMetadata, 'cMetadata')
  //      console.log(cPool, 'cPool')
 
  //      //expires in 5 weeks time
  //     //  const expiresAt = new Date(new Date().getTime() + (5 * 7 * 24 * 60 * 60 * 1000));
 
  //     //  const newCollective = await db
  //     //    .insert(collective)
  //     //    .values({
  //     //      name: community,
  //     //      cAddress: cMetadata.address,
  //     //      cWallet: cMetadata.wallet,
  //     //      cPool: cPool,
  //     //      expiresAt,
  //     //    })
  //     //    .returning();
 
  //     //  console.log(newCollective, 'NEW COLLECTIVE!')
  //    }
 
  //    return Response.json({ status: "OK", message: 'Collectives created successfully' })
 
  //  } catch (error) {
  //    console.error('Error creating collectives:', error)
  //    return Response.json({ error })
  //  } 
}
