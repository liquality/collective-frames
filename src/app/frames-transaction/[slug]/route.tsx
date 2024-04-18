/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { findFrameBySlug } from "@/utils/frame";
import { getCollectiveById } from "@/utils/collective";
import Image from "next/image";
import { ETH_CURRENCY_ADDRESS } from "@/utils/constants";
import { collective } from "@/db";
import { shortenAddress } from "@/utils";

const handleRequest = frames(async (ctx) => {
  const parts = ctx.url.pathname.split("/");
  if (parts.length <= 2 || !parts[2]) {
    throw new Error("Frame id not found");
  }
  const slug = parts[2] || "";

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

  let route = "";
  let secondRoute = "";
  const isErc20 = existingFrame.paymentCurrency !== ETH_CURRENCY_ADDRESS;
  isErc20 ? (route = "premint") : null;
  isErc20 ? (secondRoute = "mint") : null;

  if (
    ctx.message?.transactionId &&
    existingFrame &&
    isErc20 &&
    ctx.message.buttonIndex !== 2
  ) {
    return {
      image: (
        <div tw="relative bg-purple-500 text-white w-full h-full flex flex-col justify-center items-center mb-3">
          Approval transaction submitted for ERC20{" "}
          {shortenAddress(collective.memeTokenContract)} 😊
          <p>Hash: {shortenAddress(ctx.message?.transactionId)}</p>
          <img tw="rounded-lg" src={existingFrame?.frameImgUrl} width="50%" />
          <p tw="absolute bottom-15 right-0 mb-4 mr-4">Powered By</p>
          <img
            src="https://docs.liquality.io/img/logo_dark.svg"
            width="310"
            height="50"
            tw="absolute bottom-0 right-0 mb-4 mr-4"
          />
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
  } else if (
    ctx.message?.transactionId &&
    existingFrame &&
    isErc20 &&
    ctx.message.buttonIndex === 2
  ) {
    return {
      image: (
        <div tw="relative bg-purple-500 text-white w-full h-full flex flex-col justify-center items-center mb-3">
          You minted with ERC20 {shortenAddress(collective.memeTokenContract)}{" "}
          😊
          <p>{shortenAddress(ctx.message?.transactionId)}</p>
          <img tw="rounded-lg" src={existingFrame?.frameImgUrl} width="50%" />
          <p tw="absolute bottom-15 right-0 mb-4 mr-4">Powered By</p>
          <img
            src="https://docs.liquality.io/img/logo_dark.svg"
            width="310"
            height="50"
            tw="absolute bottom-0 right-0 mb-4 mr-4"
          />
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
  } else if (ctx.message?.transactionId && existingFrame && !isErc20) {
    return {
      image: (
        <div tw="relative bg-purple-500 text-white w-full h-full flex flex-col justify-center items-center mb-3">
          You minted with Base ETH 😊
          <p>{shortenAddress(ctx.message?.transactionId)}</p>
          <img tw="rounded-lg" src={existingFrame?.frameImgUrl} width="50%" />
          <p tw="absolute bottom-15 right-0 mb-4 mr-4">Powered By</p>
          <img
            src="https://docs.liquality.io/img/logo_dark.svg"
            width="310"
            height="50"
            tw="absolute bottom-0 right-0 mb-4 mr-4"
          />
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
    image: existingFrame?.frameImgUrl,

    imageOptions: {
      aspectRatio: "1:1",
    },

    buttons: [
      // @ts-ignore
      <Button action="tx" target={`/txdata/${slug}/${route}`}>
        Mint for community {collective.name}
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
