import { migrate as migrateNode } from "drizzle-orm/node-postgres/migrator";
import { migrate as migrateVercel } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "./db";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";

export async function migrate() {
  if (process.env.NODE_ENV === "production")
    await migrateVercel(db as VercelPgDatabase, {
      migrationsFolder: "./migrations",
    });
  else await migrateNode(db, { migrationsFolder: "./migrations" });
}
