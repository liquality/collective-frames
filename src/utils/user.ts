import { db, user } from "@/db";
import { sql } from "drizzle-orm";
import { neynarClient } from "./neynar";

export const findUserByFid = async (userFid: number) => {
  const existingUser = await db
    .select()
    .from(user)
    .where(sql`${user.fid} = ${userFid}`)
    .limit(1);
  console.log(existingUser, "existing user in Db call");
  if (existingUser && existingUser.length > 0) {
    return existingUser[0];
  } else {
    return null;
  }
};



export async function getAddrByFid(fid: number): Promise<string | null> {
    
    try {

        const data = await neynarClient.fetchBulkUsers([fid]);
        // Extract connected address if available, otherwise use address from body
        const connectedAddress = data.users[0]?.verified_addresses.eth_addresses[0] || data.users[0]?.custody_address || ''

        return connectedAddress
    } catch (error) {
        console.error('Error fetching profile data:', error)
        return null;
    }
}
