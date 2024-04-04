import "dotenv/config";
import { sql as sqlVercel } from "@vercel/postgres";
import { drizzle as drizzleNode } from "drizzle-orm/node-postgres";
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { Pool } from "pg";
import * as schema from './schema';


export const db =
  process.env.NODE_ENV === "production"
    ? drizzleVercel(sqlVercel, { schema })
    : drizzleNode(new Pool({ connectionString: process.env.POSTGRES_URL }));

