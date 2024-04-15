import { NextRequest, NextResponse } from "next/server";
import { erc20PreMint, getETHMintPrice, mint } from "@/utils";
import { getProvider } from "@/utils/collective";
import { ethers } from "ethers";

export async function GET(request: NextRequest, response: NextResponse) {

  //   const nft = await create1155Contract(
  //   "0xd75fbf394fF40A59f3635e72C0c8fB1e7a61F6dA",
  //   "0xcB951d0A3031208EC1b471dBfd5e92a6A7b4add7",
  //   {
  //     name: "My Collective NFT",
  //     pricePerMintETH: "0.00001",
  //     pricePerMintToken: "0.1",
  //     tokenMetaDataUri: "https://tnadjt2kpodqd17b.public.blob.vercel-storage.com/metadata_uri-9A3MAo6qbULuX5KIoz2OTW2u2YKrbT",
  //     creator: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  //     paymentCurrency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",

  //   }
  // )
  // return NextResponse.json({ nft });
  // const premintTxs = await erc20PreMint("0xb6B611c0A8F9Ae44B23154f2D95e939eefbb2D06",  {
  //   tokenAddress: `0x${"fc96a6aa5b55c4caeefb7b04eb1d5ee3046217e2"}`,
  //   currency: `0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`,// "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",//`0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`//,
  //   recipient: `0x${"d5833B738C9ECDD12C06C78BedF16FA0788f0780"}`,
  //   mintReferral: `0x${"cB951d0A3031208EC1b471dBfd5e92a6A7b4add7"}`,
  //   creator: `0x${"f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}`,
  //   quantity: BigInt(1),
  //   tokenID: BigInt(1),
  //   totalValue: "0.1",//ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),
  //   comment: "Minted via MyCollective",
  //   tokenDecimal: 6
  // })

  // Adding 0.00001 ether to the current mint price
  const mintPriceWei = await getETHMintPrice("0x48Fc3c982a022070cbC64d250Db398b82D123E68");
  const additionalEther = ethers.parseEther("0.00001"); // Convert 0.00001 ether to wei
  const totalValueWei = mintPriceWei + additionalEther; // Add in wei for precision
  const totalValueEther = ethers.formatEther(totalValueWei); // Convert back to ether string if needed
  console.log(totalValueEther, ' << totalValueEther')


  const mintTxs = await mint(
    "0xb6B611c0A8F9Ae44B23154f2D95e939eefbb2D06",
    "0xd75fbf394fF40A59f3635e72C0c8fB1e7a61F6dA",
    "0xF4225De6e4A0cEba4CA8394F7C956962BBABFA2F",
    {
      tokenAddress: "0xfc96a6aa5b55c4caeefb7b04eb1d5ee3046217e2",//"0x5e8358a3f4a704251e098ef1448dbccf272971bd",//`0x${"fc96a6aa5b55c4caeefb7b04eb1d5ee3046217e2"}`,
      currency: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",//`0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`,// `0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`//,
      recipient: `0x${"d5833B738C9ECDD12C06C78BedF16FA0788f0780"}`,
      mintReferral: `0x${"cB951d0A3031208EC1b471dBfd5e92a6A7b4add7"}`,
      creator: `0x${"f39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}`,
      quantity: BigInt(1),
      tokenID: BigInt(1),
      totalValue: totalValueEther,//ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),//"0.00001",//"0.1",//ethers.formatEther(await getETHMintPrice(`0x${"48Fc3c982a022070cbC64d250Db398b82D123E68"}`)),
      comment: "Minted via MyCollective",
      tokenDecimal: 6
    }
  )
  let provider = getProvider()
  let signer = ethers.Wallet.fromPhrase(process.env.OPERATOR_MNEMONIC!, provider)
for (const tx of [mintTxs]) {
     let txResponse = await signer.sendTransaction({
       to: tx.to,
       value: tx.value,
       data: tx.data
     })
     const txRecipt = await provider.waitForTransaction(txResponse.hash)
     console.log(txRecipt, 'txRecipt')
   } 

  return NextResponse.json({ message: "Minted success!" });

}
