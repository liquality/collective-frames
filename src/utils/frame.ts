//This file should handle all data calls to the "frame" table in DB

import { db, frame } from "@/db"
import { sql } from "drizzle-orm"


export const findFrameById = async (frameId: number) => {
    console.log(frameId, 'what is FRAME fid in db?')
    const existingFrame = await db.select().from(frame).where(sql`${frame.id} = ${frameId}`)
    console.log(existingFrame, 'existing frame in Db call')
    if (existingFrame[0]) {
        return {
            frame: existingFrame[0],
            zoraUrl: `https://zora.co/collect/base:${existingFrame[0].tokenAddress}/1`,
        }
    }
    else {
        return null
    }

}
