export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { db, collective } from "@/db";
import { ERC20_MINTER_ADDRESS, SUPPORTED_COMMUNITIES } from "@/utils/constants";
import { sql } from "drizzle-orm";
import { createCollective, createHoneyPot, createPool, generateSalt } from "@/utils/collective";

export async function GET() {
  const res = await db.select().from(collective).where(sql`${collective.expiresAt} > CURRENT_TIMESTAMP`);


  //return Response.json(res);

  try {
    /*    for (const channel of SUPPORTED_COMMUNITIES) {
         // Deploy a new collective and pool for each channel
         let salt = generateSalt()
         const createHoneyPotResult = await createHoneyPot(salt)
         const cMetadata = await createCollective()
         const cPool = await createPool(cMetadata.address, ERC20_MINTER_ADDRESS, createHoneyPotResult.honeyPot)
   
         console.log(createHoneyPotResult, 'honeypot')
         console.log(cMetadata, 'cMetadata')
         console.log(cPool, 'cPool')
   
         database.createChannel(
           channel.id,
           channel.question_id,
           channel.name,
           channel.followers,
           cMetadata.address,
           cMetadata.wallet,
           cPool,
           cMetadata.salt
         )
       } */

    let salt = generateSalt()
    const createdHoneyPotResult = await createHoneyPot(salt)
    console.log(createdHoneyPotResult, 'created???')

    return Response.json({ status: createdHoneyPotResult, message: 'Collectives created successfully' })

  } catch (error) {
    console.error('Error creating collectives:', error)
    return Response.json({ error })
  }
}
