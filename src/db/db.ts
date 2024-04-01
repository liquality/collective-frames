import "dotenv/config";
import { sql as sqlVercel } from "@vercel/postgres";
import { NodePgDatabase, drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import { Pool } from "pg";

export const db: VercelPgDatabase | NodePgDatabase =
  process.env.NODE_ENV === "production"
    ? drizzleVercel(sqlVercel)
    : drizzleNode(new Pool({ connectionString: process.env.NEXT_PUBLIC_POSTGRES_URL }));

