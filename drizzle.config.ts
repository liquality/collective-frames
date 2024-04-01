import "dotenv/config";
import type { Config } from "drizzle-kit";
export default {
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  driver: "pg",
  dbCredentials: {
    host: process.env.NEXT_PUBLIC_POSTGRES_HOST || "",
    user: process.env.NEXT_PUBLIC_POSTGRES_USER,
    password: process.env.NEXT_PUBLIC_POSTGRES_PASSWORD,
    database: process.env.NEXT_PUBLIC_POSTGRES_DATABASE || "",
  },
} satisfies Config;
