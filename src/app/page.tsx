"use client";
import sdkImage from "@/assets/img/graphic_placeholder.svg";
import Image from "next/image";
import Login from "./components/NeynarLogin";

export default function Home() {
  return (
    <div className="w-full items-center">
      <h2
        className="text-center font-bold text-7xl leading-normal tracking-tight uppercase mb-3"
        style={{ fontSize: 30, lineHeight: 1 }}
      >
        Meme NFT generator is here
      </h2>
      <h4 className="text-center font-bold text-xl leading-normal tracking-tight">
        share to mint & earn
      </h4>

      <p className="mt-3 text-center mb-5">
        Upload your meme to create a custom mint frame for sharing. Each time
        your meme is minted, your chosen pool benefits.
      </p>

      <div className="flex items-center flex-col justify-center rounded-2xl bg-white bg-opacity-70 p-4">
        {" "}
        <button className="rounded-full px-4 py-2 bg-purple-500 disabled:opacity-75 text-white focus:outline-none focus:ring-0">
          Log in with Warpcast ID
        </button>
        <p className="text-black flex text-xs mt-3">
          Not on Warpcast yet?{" "}
          <a
            href="https://warpcast.com/~/signup"
            className="text-purple-400 mx-2"
            target="_blank"
          >
            Sign up now
          </a>{" "}
          and return with your ID
        </p>
      </div>

      <div className="flex flex-col my-48 w-full">
        <div className="flex items-center justify-center">
          <Login />
        </div>
        <div className="flex items-center justify-center mt-5">
          Not on Warpcast yet?
          <a
            href="https://warpcast.com/~/signup"
            className="text-purple-400 mx-2"
            target="_blank"
          >
            Sign up now
          </a>{" "}
          and return with your ID
        </div>
      </div>

      <div className="flex items-center justify-center mt-24">
        <a
          href="https://warpcast.com/liquality"
          target="_blank"
          style={{ minWidth: 320 }}
          className="rounded-full text-center border border-white-700 px-4 py-2 bg-transparent disabled:opacity-75 text-white-500 focus:outline-none focus:ring-0"
        >
          Follow Liquality on Farcaster
        </a>
      </div>
    </div>
  );
}
