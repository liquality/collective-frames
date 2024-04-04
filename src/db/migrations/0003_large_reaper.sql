ALTER TABLE "collective_frames"."user" RENAME COLUMN "identifier" TO "fid";--> statement-breakpoint
ALTER TABLE "collective_frames"."user" DROP CONSTRAINT "user_identifier_unique";--> statement-breakpoint
ALTER TABLE "collective_frames"."user" ADD COLUMN "signer_uuid" varchar(256) NOT NULL;--> statement-breakpoint
ALTER TABLE "collective_frames"."user" ADD CONSTRAINT "user_fid_unique" UNIQUE("fid");