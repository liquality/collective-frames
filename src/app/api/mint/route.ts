import { NextRequest, NextResponse } from "next/server";
import { create1155Contract, erc20PreMint, getETHMintPrice, mint } from "@/utils";
import { getProvider } from "@/utils/collective";
import { ethers } from "ethers";
import { MintParam } from "@/types";
import { FIXED_PRICE_MINTER_ADDRESS } from "@/utils/constants";

export async function GET(request: NextRequest, response: NextResponse) {

  //   const nft = await create1155Contract(
  //   "0x081867ce5710beda62457E77e627fC3B57b2295b",
  //   "0xCdB15E8722759b5141FB624c541CC99bD2b5D279",
  //   {
  //     name: "My Collective NFT 6",
  //     pricePerMintETH: "0.00001",
  //     pricePerMintToken: "0.1",
  //     tokenMetaDataUri: "https://tnadjt2kpodqd17b.public.blob.vercel-storage.com/metadata_uri-9A3MAo6qbULuX5KIoz2OTW2u2YKrbT",
  //     creator: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", // "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  //     paymentCurrency: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  //   }
  // )
  // return NextResponse.json({ nft });

  // Adding 0.00001 ether to the current mint price
  const mintPriceWei = await getETHMintPrice(FIXED_PRICE_MINTER_ADDRESS);
  const additionalEther = ethers.parseEther("0.00001"); // Convert 0.00001 ether to wei
  const totalValueWei = mintPriceWei + additionalEther; // Add in wei for precision
  const totalValueEther = ethers.formatEther(totalValueWei); // Convert back to ether string if needed


  let mintParam: MintParam = {
    tokenAddress: `0x${"9f4263842d6d16597fce719404b8a143eb6b085e"}`,
    currency: `0x${"833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"}`,//"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
    recipient: `0x${"d5833B738C9ECDD12C06C78BedF16FA0788f0780"}`,
    mintReferral: `0x${"F9c05449Ae761BA0cd958654BB2f804D5A4Ad407"}`,
    creator: `0x${"70997970C51812dc3A010C7d01b50e0d17dc79C8"}`,
    quantity: BigInt(2),
    tokenID: BigInt(1),
    totalValue: "0.08",// totalValueEther,
    comment: "Minted via MyCollective",
    tokenDecimal: 6//18
  }
  const premintTxs = await erc20PreMint(
    "0xaDD45b5744B41B923431F9aBd27D98399f5Ef980", 
    mintParam
  )

  const mintTxs = await mint(
    "0xaDD45b5744B41B923431F9aBd27D98399f5Ef980",
    "0x081867ce5710beda62457E77e627fC3B57b2295b",
    "0x9e351Bf4F2F1FdCD76a4C40E32D7DB0330beE53C",
    {
      tokenAddress: mintParam.tokenAddress,
      currency: mintParam.currency,
      recipient: mintParam.recipient,
      mintReferral: mintParam.mintReferral,
      creator: mintParam.creator,
      quantity: mintParam.quantity,
      tokenID: mintParam.tokenID,
      totalValue: mintParam.totalValue,//totalValueEther,
      comment:mintParam.comment,
      tokenDecimal: mintParam.tokenDecimal
    }
  )
  let provider = getProvider()
  let signer = ethers.Wallet.fromPhrase(process.env.OPERATOR_MNEMONIC!, provider)
for (const tx of [premintTxs, mintTxs]) {
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
