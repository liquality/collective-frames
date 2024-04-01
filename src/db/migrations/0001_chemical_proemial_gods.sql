ALTER TABLE "collective_frames"."frame" ADD COLUMN "metadata_url" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "collective_frames"."frame" ADD COLUMN "token_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "collective_frames"."collective" DROP COLUMN IF EXISTS "token_id";