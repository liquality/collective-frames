import "dotenv/config";
import { migrate as migrateNode } from "drizzle-orm/node-postgres/migrator";
import { migrate as migrateVercel } from "drizzle-orm/vercel-postgres/migrator";
import { db } from "./db";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import path from "path";

export async function migrate() {
  console.log('db', process.env)
  if (process.env.NODE_ENV === "production")
    await migrateVercel(db as VercelPgDatabase, {
      migrationsFolder: path.join(__dirname, "./migrations"),
    });
  else
    await migrateNode(db, {
      migrationsFolder: path.join(__dirname, "./migrations"),
    });
}
