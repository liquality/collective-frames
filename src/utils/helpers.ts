import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { ErrorRes } from "@neynar/nodejs-sdk/build/neynar-api/v2";

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
