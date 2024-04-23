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

  console.log(collective, "what is collective?");
  let route = "";
  let secondRoute = "";
  const isErc20 = existingFrame.paymentCurrency !== ETH_CURRENCY_ADDRESS;
  isErc20 ? (route = "premint") : null;
  isErc20 ? (secondRoute = "mint") : null;

  console.log(
    ctx.message,
    "CTX message",
    ctx.searchParams,
    "ALL SEARCHPARAMS",
    ctx
  );

  console.log(
    ctx.message?.transactionId &&
      existingFrame &&
      isErc20 &&
      ctx.searchParams.action === "premint",
    "Initate Second ERC20"
  );

  console.log(
    ctx.message?.transactionId &&
      existingFrame &&
      isErc20 &&
      ctx.searchParams.action !== "premint",
    "Success ERC20 mint"
  );

  //initate second transaction erc20 mint
  if (
    ctx.message?.transactionId &&
    existingFrame &&
    isErc20 &&
    ctx.searchParams.action === "premint"
  ) {
    return {
      image: (
        <div tw="relative bg-white text-black w-full h-full flex flex-col justify-center items-center mb-3">
          <h1 className="font-montserrat">Ready to mint</h1>
          <img
            tw="rounded-lg"
            src={existingFrame?.frameImgUrl}
            width="100"
            height="100"
          />
          <h2>{existingFrame.name}</h2>
          <p tw="absolute font-extralight bottom-0 left-5 mb-4 mr-4">
            Powered By
          </p>
          <img
            src="https://docs.liquality.io/img/logo_light.svg"
            width="205"
            height="40"
            tw="absolute bottom-0 left-60 mb-4 mr-4"
          />
        </div>
      ),
      imageOptions: {
        aspectRatio: "1:1",
      },
      buttons: [
        <Button
          action="tx"
          target={`/txdata/${slug}`}
          post_url={{
            pathname: `/${slug}`,
            query: {
              action: "secondTx",
            },
          }}
        >
          {`Mint with ${collective.name}`}
        </Button>,
      ],
    };
    //success ERC20 mint
  } else if (
    ctx.message?.transactionId &&
    existingFrame &&
    isErc20 &&
    ctx.searchParams.action !== "premint"
  ) {
    return {
      image: (
        <div tw="relative bg-white text-black w-full h-full flex flex-col justify-center items-center mb-3">
          <img
            tw="rounded-lg"
            src="https://cdn.discordapp.com/attachments/1013716252562296833/1230766843564916736/checkmark.png?ex=663483f2&is=66220ef2&hm=7dd7a7893f2b8ac2b342e53d9cde6c6851a0ef2122577b6cb4f40af870581624&checkmark.svg"
            width="100"
            height="100"
          />
          <h1 className="font-montserrat">Minted with ERC20</h1>
          <img
            tw="rounded-lg"
            src={existingFrame?.frameImgUrl}
            width="200"
            height="200"
          />
          <h2>{existingFrame.name}</h2>
          <p tw="absolute font-extralight bottom-0 left-5 mb-4 mr-4">
            Powered By
          </p>
          <img
            src="https://docs.liquality.io/img/logo_light.svg"
            width="205"
            height="40"
            tw="absolute bottom-0 left-60 mb-4 mr-4"
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
        <Button
          action="link"
          target={`https://meme-amplifier-machine.liquality.io/`}
        >
          Create your own meme
        </Button>,
        <Button
          action="link"
          target={`https://zora.co/collect/base:${existingFrame.nftTokenAddress}/1`}
        >
          View on Zora
        </Button>,
      ],
    };
    //Success ETH mint
  } else if (
    ctx.message?.transactionId &&
    existingFrame &&
    !isErc20 &&
    ctx.searchParams.action === "ethMint"
  ) {
    return {
      image: (
        <div tw="relative bg-white text-black w-full h-full flex flex-col justify-center items-center mb-3">
          <img
            tw="rounded-lg"
            src="https://cdn.discordapp.com/attachments/1013716252562296833/1230766843564916736/checkmark.png?ex=663483f2&is=66220ef2&hm=7dd7a7893f2b8ac2b342e53d9cde6c6851a0ef2122577b6cb4f40af870581624&checkmark.svg"
            width="100"
            height="100"
          />
          <h1 className="font-montserrat">Minted with Base ETH</h1>
          <img
            tw="rounded-lg"
            src={existingFrame?.frameImgUrl}
            width="200"
            height="200"
          />
          <h2>{existingFrame.name}</h2>
          <p tw="absolute font-extralight bottom-0 left-5 mb-4 mr-4">
            Powered By
          </p>
          <img
            src="https://docs.liquality.io/img/logo_light.svg"
            width="205"
            height="40"
            tw="absolute bottom-0 left-60 mb-4 mr-4"
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
        <Button
          action="link"
          target={`https://meme-amplifier-machine.liquality.io/`}
        >
          Create your own meme
        </Button>,
        <Button
          action="link"
          target={`https://zora.co/collect/base:${existingFrame.nftTokenAddress}/1`}
        >
          View on Zora
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
      <Button
        action="tx"
        target={`/txdata/${slug}/${route}`}
        post_url={{
          pathname: `/${slug}`,
          query: {
            action: isErc20 ? "premint" : "ethMint",
          },
        }}
      >
        {`Pay with ${isErc20 ? collective.name + " then mint" : "Base ETH"}`}
      </Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
