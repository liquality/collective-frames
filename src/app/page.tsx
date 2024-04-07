"use client";
import sdkImage from "@/assets/img/graphic_placeholder.svg";
import Image from "next/image";
import Login from "./components/FarcasterLogin";

export default function Home() {
  const onSuccess = (data: any) => {
    console.log("onSuccess", data);
  };
  return (
    <div className="flex flex-col w-full items-center justify-center">
      <div
        style={{ width: "80%" }}
        className=" flex items-center flex-col justify-center rounded-2xl bg-white bg-opacity-70 p-4"
      >
        <Login />
        <p className="text-black flex text-xs mt-3">
          Not on Warpcast yet?{" "}
          <a
            href="https://warpcast.com/~/signup"
            className="text-purple-400 mx-2"
            target="_blank"
          >
            <b>Sign up now</b>
          </a>{" "}
          and return with your ID
        </p>
      </div>

      <div className="flex items-center justify-center mt-24">
        <a
          href="https://warpcast.com/liquality"
          target="_blank"
          style={{ minWidth: 320 }}
          className="rounded-full text-center border border-white-500 px-4 py-2 bg-transparent disabled:opacity-75 text-white-500 focus:outline-none focus:ring-0"
        >
          Follow Liquality on Farcaster
        </a>
      </div>
    </div>
  );
}
