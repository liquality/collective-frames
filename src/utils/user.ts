import { db, user } from "@/db";

import { sql } from "drizzle-orm"

export const findUserByFid = async (userFid: number) => {
    console.log(userFid, 'what is user fid in db?')
    const existingUser = await db.select().from(user).where(sql`${user.fid} = ${userFid}`)
    console.log(existingUser, 'existing user in Db call')
    if (existingUser[0]) { return existingUser[0] }
    else {
        return null
    }

}
