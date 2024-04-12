CREATE TABLE IF NOT EXISTS "collective" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"c_address" varchar(256) NOT NULL,
	"c_wallet" varchar(256) NOT NULL,
	"c_pool" varchar(256) NOT NULL,
	"honey_pot" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"expiresAt" timestamp,
	CONSTRAINT "collective_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256),
	"slug" varchar(256) NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"metadata_url" varchar(256) NOT NULL,
	"price_in_eth" varchar(256) NOT NULL,
	"payment_currency" varchar(256) NOT NULL,
	"token_id" integer NOT NULL,
	"nft_token_address" varchar(256) NOT NULL,
	"collective_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" serial PRIMARY KEY NOT NULL,
	"fid" integer NOT NULL,
	"wallet_address" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_fid_unique" UNIQUE("fid"),
	CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frame" ADD CONSTRAINT "frame_collective_id_collective_id_fk" FOREIGN KEY ("collective_id") REFERENCES "collective"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "frame" ADD CONSTRAINT "frame_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
