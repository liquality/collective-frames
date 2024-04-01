CREATE SCHEMA "collective_frames";
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collective_frames"."collective" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"c_address" varchar(256) NOT NULL,
	"c_wallet" varchar(256) NOT NULL,
	"c_pool" varchar(256) NOT NULL,
	"token_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "collective_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collective_frames"."frame" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(256),
	"slug" varchar(256) NOT NULL,
	"image_url" varchar(256) NOT NULL,
	"token_address" varchar(256) NOT NULL,
	"collective_id" integer,
	"created_by" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collective_frames"."user" (
	"id" serial PRIMARY KEY NOT NULL,
	"identifier" integer NOT NULL,
	"wallet_address" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_identifier_unique" UNIQUE("identifier"),
	CONSTRAINT "user_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collective_frames"."frame" ADD CONSTRAINT "frame_collective_id_collective_id_fk" FOREIGN KEY ("collective_id") REFERENCES "collective_frames"."collective"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collective_frames"."frame" ADD CONSTRAINT "frame_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "collective_frames"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
