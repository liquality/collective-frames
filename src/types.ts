import { frame, collective, user } from "@/db";
import { HDAccount } from "viem";

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
    nftImgUrl: string;
    frameImgUrl: string;

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
    recipient: `0x${string}`; // The caster
    creator: `0x${string}`;
    quantity: bigint;
    tokenAddress: `0x${string}`; // NFT contract address
    tokenID: bigint; // Defaut: 1
    totalValue: string;
    currency: `0x${string}`; // Zero address or ERC20 address
    mintReferral: `0x${string}`; // honeyPot address
    tokenDecimal: number; // ETH = 18; 
    comment: string;
}

export type NFTData = {
    name: string,
    pricePerMintETH: string,
    pricePerMintToken?: string,
    tokenMetaDataUri: string,
    creator: `0x${string}`
    paymentCurrency: `0x${string}` // Token contract address for ERC20 payment, else 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
}

export type Transaction = {
    abi: Array<any>,
    to: `0x${string}`,
    value: bigint,
    data: string,
}

export type CMetadata = {
    address: string;
    wallet: string;
    nonceKey: bigint;
}

export type TokenInfo = {
    ticker: string;
    contractAddress: string;
    decimal: number;
    coinGeckoId: string;
};

export type WriteContractParam = {
    account: HDAccount;
    abi: readonly any[];
    address: `0x${string}`;
    functionName: any;
    args: any[];
    nonce: number;
    maxFeePerGas?: bigint | undefined;
}