import { TransactionTargetResponse } from "frames.js";
import { getFrameMessage } from "frames.js/next/server";
import { NextRequest, NextResponse } from "next/server";
import {
  Abi,
  createPublicClient,
  encodeFunctionData,
  getContract,
  http,
} from "viem";
import { base, optimism } from "viem/chains";
import { storageRegistryABI } from "../../contract-abi";
import { findFrameById, findFrameBySlug } from "@/utils/frame";
import { getCollectiveById } from "@/utils/collective";
import { erc20PreMint, mint } from "@/utils";

export async function POST(
  req: NextRequest
): Promise<NextResponse<TransactionTargetResponse>> {
  const parts = req.url.split("/");
  const slug = parts[parts.length - 1];
  //use existing frame data to get token params & mint
  const existingFrame = await findFrameBySlug(slug);
  if (!existingFrame) {
    throw new Error("Frame with slug not found" + slug);
  }
  const collective = await getCollectiveById(
    existingFrame.collectiveId as number
  );

  const json = await req.json();
  const frameMessage = await getFrameMessage(json);
  if (!frameMessage) {
    throw new Error("No frame message");
  }

  // Get current storage price
  const units = BigInt(1);

  const calldata = encodeFunctionData({
    abi: storageRegistryABI,
    functionName: "rent",
    args: [BigInt(frameMessage.requesterFid), units],
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  /*   const erc20TransferData = new ethers.Contract(mintParam.currency, ERC20_ABI).interface.encodeFunctionData(
    'transfer',
    [c_wallet, totalValue] // TODO: Update to use Per value or unbounded
)
const transferData = {
    to: mintParam.currency,
    data: erc20TransferData,
    value: BigInt(0)
}


let batchData = collectiveBatchExecuteData(value, data, dest, c_wallet)
let batchTransactionData = {
    to: c_wallet,
    data: batchData,
    value: BigInt(0)
}

return [
     transferData: {
    to: `0x${string}`;
    data: string;
    value: bigint;
}, 
    batchTransactionData: {
    to: `0x${string}`;
    data: string;
    value: bigint;
}
] */

  //TODO: Only call the premint if erc20mint
  const premintTx = await erc20PreMint(
    "0xb6B611c0A8F9Ae44B23154f2D95e939eefbb2D06",
    {
      tokenAddress: `0x${"fc96a6aa5b55c4caeefb7b04eb1d5ee3046217e2"}`,
      currency: `0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`, // "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",//`0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`//,
      recipient: `0x${"d5833B738C9ECDD12C06C78BedF16FA0788f0780"}`,
      mintReferral: `0x${"cB951d0A3031208EC1b471dBfd5e92a6A7b4add7"}`,
      creator: `0x${"f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}`,
      quantity: BigInt(1),
      tokenID: BigInt(1),
      totalValue: "0.1", //ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),
      comment: "Minted via MyCollective",
      tokenDecimal: 6,
    }
  );
  /*  const mintTxs = await mint(
    "0xb6B611c0A8F9Ae44B23154f2D95e939eefbb2D06",
    "0xd75fbf394fF40A59f3635e72C0c8fB1e7a61F6dA",
    "0xF4225De6e4A0cEba4CA8394F7C956962BBABFA2F",
    {
      tokenAddress: `0x${"fc96a6aa5b55c4caeefb7b04eb1d5ee3046217e2"}`,
      currency: `0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`, // "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",//`0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`//,
      recipient: `0x${"d5833B738C9ECDD12C06C78BedF16FA0788f0780"}`,
      mintReferral: `0x${"cB951d0A3031208EC1b471dBfd5e92a6A7b4add7"}`,
      creator: `0x${"f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}`,
      quantity: BigInt(1),
      tokenID: BigInt(1),
      totalValue: "0.1", //ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),
      comment: "Minted via MyCollective",
      tokenDecimal: 6,
    }
  ); */

  console.log(premintTx, "MINT TX");

  return NextResponse.json({
    chainId: "eip155:8453", // base mainnet
    method: "eth_sendTransaction",
    params: {
      abi: premintTx.abi,
      to: premintTx.to,
      data: premintTx.data as `0x${string}`,
      value: premintTx.value.toString(),
    },
  });
}
