
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Auth } from "./cookie-auth";

//This file handles all read and write using Neynar Client sdk
export const neynarClient = new NeynarAPIClient(process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "");


export const writeCast = (text: string) => {
    console.log(Auth.getUser.signerUuid, 'wats signer?')
    neynarClient.publishCast(Auth.getUser.signerUuid, text)
};