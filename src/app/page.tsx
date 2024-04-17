/* eslint-disable @next/next/no-img-element */
"use client";

import Login from "./components/FarcasterLogin";

export default function Home() {
  const onSuccess = (data: any) => {
    console.log("onSuccess!", data);
  };
  return (
    <div className="relative flex flex-col w-full md:w-4/5 items-center justify-center">
      <img src="/main-bg.png" alt="" className="object-fill hidden md:block" />
      <img
        src="/main-bg-mobile.png"
        alt=""
        className="object-fill block md:hidden"
      />
      <div className="absolute flex flex-col items-center justify-center w-75 md:w-2/4 rounded-2xl bg-white bg-opacity-80 p-6">
        <Login />
        <p className="text-black text-xl mt-3 text-center">
          Not on Warpcast yet?{" "}
          <a
            href="https://warpcast.com/~/signup"
            className="text-purple-500 mx-2"
            target="_blank"
          >
            <b>Sign up now</b>
          </a>{" "}
          and return with your ID
        </p>
      </div>
    </div>
  );
}
