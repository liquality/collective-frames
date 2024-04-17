import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  fid: integer("fid").notNull().unique(),
  walletAddress: varchar("wallet_address", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const collective = pgTable("collective", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).unique().notNull(),
  cAddress: varchar("c_address", { length: 256 }).notNull(),
  cWallet: varchar("c_wallet", { length: 256 }).notNull(),
  cPool: varchar("c_pool", { length: 256 }).notNull(),
  honeyPot: varchar("honey_pot", { length: 256 }).notNull(),
  memeTokenContract: varchar("meme_token_contract", { length: 256 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expiresAt")
});

export const frame = pgTable("frame", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 256 }),
  slug: varchar("slug", { length: 256 }).notNull(),
  nftImgUrl: varchar("nft_img_url", { length: 256 }).notNull(),
  frameImgUrl: varchar("frame_img_url", { length: 256 }).notNull(),
  metaDataUrl: varchar("metadata_url", { length: 256 }).notNull(),
  priceInToken: varchar("price_in_token", { length: 256 }).notNull(),
  decimal: integer("decimal").notNull(),
  paymentCurrency: varchar("payment_currency", { length: 256 }).notNull(),
  tokenId: integer("token_id").notNull(),
  nftTokenAddress: varchar("nft_token_address", { length: 256 }).notNull(),
  collectiveId: integer("collective_id").references(() => collective.id),
  createdBy: integer("created_by").references(() => user.id),
  createdAt: timestamp("created_at").defaultNow(),
});

