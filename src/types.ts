import { frame, collective, user } from "@/db";

export type NewFrame = typeof frame.$inferInsert;
export type CollectiveItem = typeof collective.$inferSelect;

export type CreateFrameResult = NewFrame | {
    imageUrl: string;
}