//This route is for calling the mint() function, which is either the
//second transaction for erc20 mints, or the first and only transaction for ETH mints

import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import { findFrameBySlug } from "@/utils/frame";
import { getCollectiveById } from "@/utils/collective";
import { getETHMintPrice, mint } from "@/utils";
import { findUserById } from "@/utils/user";
import { ethers } from "ethers";
import {
  ETH_CURRENCY_ADDRESS,
  FIXED_PRICE_MINTER_ADDRESS,
} from "@/utils/constants";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const url = req.url;
  const parts = url.split("?");
  const slug = parts[0].split("/").pop();
  if (!slug) {
    throw new Error("No slug in url" + url);
  }

  console.log(req, "what is req???");

  //use existing frame data to get token params & mint
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

  const creatorOfFrame = await findUserById(existingFrame.createdBy as number);
  if (!creatorOfFrame) {
    throw new Error(
      "No creator for this frame found with user id:" + existingFrame.createdBy
    );
  }

  const json = await req.json();
  const frameMessage = await getFrameMessage(json);
  if (!frameMessage) {
    throw new Error("No frame message");
  }

  console.log(
    frameMessage.connectedAddress,
    "connected address?",
    frameMessage
  );

  const isErc20 = existingFrame.paymentCurrency !== ETH_CURRENCY_ADDRESS;

  const mintPriceWei = await getETHMintPrice(FIXED_PRICE_MINTER_ADDRESS);
  const additionalEther = ethers.parseEther(existingFrame.priceInToken); // Convert 0.00001 ether to wei
  const totalValueWei = mintPriceWei + additionalEther; // Add in wei for precision
  const totalValueEther = ethers.formatEther(totalValueWei); // Convert back to ether string if needed
  console.log(totalValueEther, " << totalValueEther");

  const mintTx = await mint(
    collective.cWallet as `0x${string}`,
    collective.cAddress as `0x${string}`,
    collective.cPool as `0x${string}`,
    {
      tokenAddress: existingFrame.nftTokenAddress as `0x${string}`,
      currency: existingFrame.paymentCurrency as `0x${string}`,
      recipient: frameMessage.connectedAddress as `0x${string}`,
      mintReferral: collective.honeyPot as `0x${string}`,
      creator: creatorOfFrame.walletAddress as `0x${string}`,
      quantity: BigInt(1),
      tokenID: BigInt(1),
      totalValue: isErc20 ? existingFrame.priceInToken : totalValueEther, //this should be total value in currency, for example 0.1 USDT or 0.0001 ETH
      comment: "Minted via MyCollective",
      tokenDecimal: existingFrame.decimal,
    }
  );

  console.log(mintTx, "MINT TX");

  return NextResponse.json({
    chainId: "eip155:8453", // base mainnet
    method: "eth_sendTransaction",
    params: {
      abi: mintTx.abi,
      to: mintTx.to,
      data: mintTx.data as `0x${string}`,
      value: mintTx.value.toString(),
    },
  });
}
