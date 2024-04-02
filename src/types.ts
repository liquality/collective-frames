import { frame, collective, user } from "@/db";

export type NewFrame = typeof frame.$inferInsert;
export type CollectiveItem = typeof collective.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type CreateFrameResult = NewFrame | {
    imageUrl: string;
}

export interface UserInfo {
    signerUuid: string;
    fid: string;
}

export type Frame = {
    id: number;
    name: string;
    description: string;
    slug: string;
    imageUrl: string;
    metaDataUrl: string;
    tokenId: number;
    tokenAddress: string;
    collectiveId: number;
    createdBy: number;
    createdAt: string;
};

export type FrameWithZoraUrl = {
    frame: Frame;
    zoraUrl: string;
};
