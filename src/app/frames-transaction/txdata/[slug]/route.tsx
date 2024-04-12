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

  const STORAGE_REGISTRY_ADDRESS = "0x00000000fcCe7f938e7aE6D3c335bD6a1a7c593D";

  const storageRegistry = getContract({
    address: STORAGE_REGISTRY_ADDRESS,
    abi: storageRegistryABI,
    publicClient: publicClient,
  });

  const unitPrice = await storageRegistry.read.price([units]);

  console.log(
    {
      chainId: "eip155:10", // OP Mainnet 10
      method: "eth_sendTransaction",
      params: {
        abi: storageRegistryABI as Abi,
        to: STORAGE_REGISTRY_ADDRESS,
        data: calldata,
        value: unitPrice.toString(),
      },
    },
    "DATA"
  );

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

  return NextResponse.json({
    chainId: "eip155:10", // OP Mainnet 10
    method: "eth_sendTransaction",
    params: {
      abi: storageRegistryABI as Abi,
      to: STORAGE_REGISTRY_ADDRESS,
      data: calldata,
      value: unitPrice.toString(),
    },
  });
}
