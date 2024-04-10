import { frame, collective, user } from "@/db";

export type NewFrame = typeof frame.$inferInsert;
export type CollectiveItem = typeof collective.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type CreateFrameResult = NewFrame | {
    imageUrl: string;
}

export interface UserInfo {
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

export type MintParam = {
    recipient: `0x${string}`;
    creator: `0x${string}`;
    quantity: bigint;
    tokenAddress: `0x${string}`;
    tokenID: bigint;
    totalValue: string;
    currency: `0x${string}`;
    mintReferral: `0x${string}`;
    tokenDecimal: number;
    comment: string;
}

export type NFTData = {
    name: string, 
    pricePerMintETH: string, 
    pricePerMintToken?: string,
    tokenMetaDataUri: string, 
    creator: `0x${string}`
    paymentCurrency: `0x${string}`
}

export type Transaction = { 
    to: `0x${string}`,
    value: bigint,
    data: string,
}

export type CMetadata = {
    address: string;
    wallet: string;
    nonceKey: bigint;
  }