/* eslint-disable react/jsx-key */
import { Button } from "frames.js/next";
import { frames } from "./frames";
import { findFrameBySlug } from "@/utils/frame";
import { getCollectiveById } from "@/utils/collective";
import Image from "next/image";
import { ETH_CURRENCY_ADDRESS } from "@/utils/constants";

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

  console.log(existingFrame, "existing frame?");
  /*  const collective = await getCollectiveById(
    existingFrame.collectiveId as number
  ); */

  let route = "";
  const isErc20 = existingFrame.paymentCurrency !== ETH_CURRENCY_ADDRESS;
  console.log(isErc20, "IS ERC20?");
  isErc20 ? (route = "premint") : null;
  console.log(existingFrame, ctx.message?.transactionId, "TRANSACTION ID AND");

  if (ctx.message?.transactionId && existingFrame) {
    let btnArray;
    !isErc20
      ? (btnArray = [
          <Button
            action="link"
            target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
          >
            View on block explorer
          </Button>,
        ])
      : [
          <Button
            action="link"
            target={`https://www.onceupon.gg/tx/${ctx.message.transactionId}`}
          >
            View on block explorer
          </Button>,
          <Button action="tx" target={`/txdata/${slug}`}>
            Initate second transaction for mint
          </Button>,
        ];

    console.log();

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
  }

  return {
    image: <img src={existingFrame.imageUrl} alt="mint_img" />,
    imageOptions: {
      aspectRatio: "1:1",
    },
    buttons: [
      <Button action="tx" target={`/txdata/${slug}/${route}`}>
        Mint!
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
