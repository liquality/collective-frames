import {
  integer,
  pgSchema,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const appSchema = pgSchema("collective_frames_app")

export const user = appSchema.table("user", {
  id: serial("id").primaryKey(),
  identifier: integer("identifier").notNull().unique(),
  walletAddress: varchar("wallet_address", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collective = appSchema.table("collective", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  cAddress: varchar("c_address", { length: 256 }).notNull(),
  cwallet: varchar("c_wallet", { length: 256 }).notNull(),
  cPool: varchar("c_pool", { length: 256 }).notNull(),
  tokenId: integer("token_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const frame = appSchema.table("frame", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  slug: varchar("slug", { length: 256 }).notNull(),
  imageUrl: varchar("image_url", { length: 256 }).notNull(),
  tokenAddress: varchar("token_address", { length: 256 }).notNull(),
  collectiveId: integer("collective_id").references(() => collective.id),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

