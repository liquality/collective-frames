import { db, collective } from "@/db";
export async function GET() {
    const res = await db.select().from(collective);
    return Response.json(res);
  }