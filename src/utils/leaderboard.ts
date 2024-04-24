import { collective, db } from "@/db"
import { sql } from "drizzle-orm"


//Use this sql in this function to return all the collectives and their corresponding creations
/* 

SELECT 
    collective.name AS collective_name,
    collective.id AS collective_id,
    frame.name AS frame_name,
    frame.nft_token_address,
    COUNT(frame.id) AS num_frames_created
FROM 
    frame
JOIN 
    collective ON frame.collective_id = collective.id
GROUP BY 
    collective.name, collective.id, frame.name, frame.nft_token_address;

*/

/* export const getFramesPerCollective = async (userId: number) => {
    const existingCollectives = await db.select().from(collective).where(sql`${collective.id} = ${userId}`)
    if (existingCollectives[0]) { return existingCollectives[0] }
    else {
        return null
    }

} */

export const getFramesPerCollective = async () => {

    const framesPerCollective = await db.execute(sql`SELECT 
                            LOWER(collective.name) AS collective_name,
                            COUNT(frame.id) AS num_frames_created
                        FROM 
                            frame
                        JOIN 
                            collective ON frame.collective_id = collective.id
                        GROUP BY 
                            collective_name;`
    )

    /*     console.log(framesPerCollective,)
    
    
        const framesPerCollectiveMap: Record<string, number> = {};
        framesPerCollective.rows.forEach((row: any) => {
            framesPerCollectiveMap[row.collective_name] = row.num_frames_created;
        }); */

    return framesPerCollective.rows;
}

