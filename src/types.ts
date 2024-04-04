import { frame, collective, user } from "@/db";

interface Window {
  onSignInSuccess?: (data: any) => void; // Replace 'any' with a more specific type if known
}
export interface UserInfo {
  signerUuid: string;
  fid: string;
}

export type NewFrame = typeof frame.$inferInsert;
export type CollectiveItem = typeof collective.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type CreateFrameResult =
  | NewFrame
  | {
      imageUrl: string;
    };

export interface UserInfo {
  signerUuid: string;
  fid: string;
}

export type Frame = typeof frame.$inferSelect;

export type FrameWithZoraUrl = {
  frame: Frame;
  zoraUrl: string;
};
