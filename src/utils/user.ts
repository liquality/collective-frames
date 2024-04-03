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


export async function getAddrByFid(fid: number): Promise<string | void> {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
        },
    }
    try {
        // Searchcaster API
        const resp = await fetch(
            `https://searchcaster.xyz/api/profiles?fid=${fid}`,
            options
        )
        if (!resp.ok) {
            throw new Error('Network response was not ok')
        }
        const data = await resp.json()

        // Extract connected address if available, otherwise use address from body
        const connectedAddress = data[0]?.connectedAddress || data[0]?.body.address

        return connectedAddress
    } catch (error) {
        return console.error('Error fetching profile data:', error)
    }
}
