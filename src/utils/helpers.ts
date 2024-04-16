import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";
import { getETHMintPrice } from ".";
import { FIXED_PRICE_MINTER_ADDRESS } from "./constants";
import { ethers } from "ethers";
import { put } from "@vercel/blob";
import { v4 as uuid } from "uuid";
import * as imageConversion from 'image-conversion';


export const welcomeMessages = [
  "Wowow Farcaster",
  // "Join the conversation. Sign in to share your story on Warpcast.",
  // "Ready to make your mark? Sign in to start casting on Warpcast.",
  // "Sign in to cast your thoughts and connect with the Warpcast community.",
  // "Be part of the decentralized dialogue. Sign in to cast your first post now.",
  // "Let's get your ideas out there. Sign in to start casting your unique perspective.",
  // "Elevate your voice. Sign in and amplify your message.",
  // "Connect, engage, and influence. Sign in to begin your Warpcast journey.",
  // "Make waves with your words. Sign in and cast away!",
  // "Sign in and join a new era of social networking.",
];

export const getMessage = (messagesList: string[]) => {
  return messagesList[Math.floor(Math.random() * messagesList.length)];
};


export const removeSearchParams = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

export const convertToEthPrice = async (priceInToken: string) => {
  const mintPriceWei = await getETHMintPrice(FIXED_PRICE_MINTER_ADDRESS);
  const additionalEther = ethers.parseEther(priceInToken); // Convert 0.00001 ether to wei
  const totalValueWei = mintPriceWei + additionalEther; // Add in wei for precision
  const totalValueEther = ethers.formatEther(totalValueWei); // Convert back to ether string if needed
  console.log(totalValueEther, " << totalValueEther");
  return totalValueEther
};



export function generateSalt(length: number = 16): number {
  const characters = '0123456789'
  const charactersLength = 4
  let salt = ''

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength)
    salt += characters.charAt(randomIndex)
  }

  // Assuming you want to convert the string salt to a BigNumberish
  return Number(salt)
}


export const parseQueryUrl = (urlString: string) => {
  const parsedUrl = new URL(urlString);
  const queryString = parsedUrl.search;

  const queryParameters = new URLSearchParams(queryString);

  // convert the query parameters object to a plain JavaScript object
  const queryParamsObject = {};
  for (const [key, value] of queryParameters.entries()) {
    // @ts-ignore
    queryParamsObject[key] = value;
  }
  return queryParamsObject
}
