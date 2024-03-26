/* eslint-disable react/jsx-key */
import { createFrames, Button } from "frames.js/next";
import { NextResponse } from "next/server";

const frames = createFrames({ basePath: "/frames"});
const handleRequest = frames(async (ctx) => {
    const parts = ctx.url.pathname.split('/')
    if(parts.length <= 2 || !parts[2]) {
      throw new Error('Frame id not found');
    }
    const frameId = parts[2];
    console.log({ parts });
  return {
    image: (
     <>
     <p>The Frame Id is {frameId}</p>
      <span>
        {ctx.pressedButton
          ? `I clicked ${ctx.searchParams.value}`
          : `Click some button`}
      </span></>
    ),
    buttons: [
      <Button action="post" target={{ query: { value: "Yes" }}}>
        Say Yes
      </Button>,
      <Button action="post" target={{ query: { value: "No" }}}>
        Say No
      </Button>,
    ],
  };
});
 
export const GET = handleRequest;
export const POST = handleRequest;