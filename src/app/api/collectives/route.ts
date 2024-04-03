import { db, collective } from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
    const res = await db.select().from(collective).where(sql`${collective.expiresAt} > CURRENT_TIMESTAMP`);
    return Response.json(res);
  }