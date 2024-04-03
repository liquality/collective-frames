
import { NeynarAPIClient } from "@neynar/nodejs-sdk";
import { Auth } from "./cookie-auth";
import { toast } from "react-toastify";



//This file handles all read and write using Neynar Client sdk
const client = new NeynarAPIClient("NEYNAR_API_DOCS" || "");

export const writeCast = (text: string) => {
    console.log(Auth.getUser.signerUuid, 'wats signer?')
    if (text) {
        client.publishCast(Auth.getUser.signerUuid, text,)
    } else toast("Cast needs to minimum 1 charachter")
};
