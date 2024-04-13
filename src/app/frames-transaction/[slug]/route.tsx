/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { findFrameBySlug } from "@/utils/frame";
import { getCollectiveById } from "@/utils/collective";
import Image from "next/image";
import { ETH_CURRENCY_ADDRESS } from "@/utils/constants";
import { collective } from "@/db";

const handleRequest = frames(async (ctx) => {
  const parts = ctx.url.pathname.split("/");
  if (parts.length <= 2 || !parts[2]) {
    throw new Error("Frame id not found");
  }
  const slug = parts[2] || "";
  console.log(ctx.url, "ctx url:", slug);
  const existingFrame = await findFrameBySlug(slug);
  if (!existingFrame) {
    throw new Error("Frame with slug not found" + slug);
  }
  const collective = await getCollectiveById(
    existingFrame.collectiveId as number
  );
  if (!collective) {
    throw new Error("No frame message");
  }

  console.log(existingFrame, "existing frame?");
  /*  const collective = await getCollectiveById(
    existingFrame.collectiveId as number
  ); */

  let route = "";
  let secondRoute = "";

  const isErc20 = existingFrame.paymentCurrency !== ETH_CURRENCY_ADDRESS;

  console.log(isErc20, "IS ERC20?");
  isErc20 ? (route = "premint") : null;
  isErc20 ? (secondRoute = "mint") : null;

  console.log(existingFrame, ctx.message?.transactionId, "TRANSACTION ID AND");

  console.log(ctx, "CTX SHOUKD BE DIFFERENTOR");

  //if erc20  - > go to premint btn
  // 1) if eth - > same btn but goes to mint
  // 2) if eth - > goes to contragts u minted here is your txId
  //if erc20

  if (ctx.message?.transactionId && existingFrame && isErc20) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          Transaction submitted! {ctx.message.transactionId} Now go mint!
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
        <Button action="tx" target={`/txdata/${slug}`}>
          Initate second transaction for mint
        </Button>,
      ],
    };
  } else if (ctx.message?.transactionId && existingFrame && !isErc20) {
    return {
      image: (
        <div tw="bg-purple-800 text-white w-full h-full justify-center items-center flex">
          You minted with ETH {ctx.message.transactionId}
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="link"
          target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
        >
          View on block explorer
        </Button>,
      ],
    };
  }

  return {
    image: (
      <img
        width="300px"
        height="200px"
        src={existingFrame.imageUrl}
        alt="mint_img"
      />
    ),
    imageOptions: {
      aspectRatio: "1:1",
    },

    buttons: [
      // @ts-ignore
      <Button action="tx" target={`/txdata/${slug}/${route}`}>
        Mint for community: {collective.name}
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
