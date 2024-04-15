export const maxDuration = 40; // 40 seconds
export const dynamic = 'force-dynamic';

import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { create1155Contract, pinFileToIPFS, toTokenNativeAmount } from "@/utils";
import { db, frame, user } from "@/db";
import { and, eq } from "drizzle-orm";
import { findUserByFid } from "@/utils/user";
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_USER_FID } from "@/utils/cookie-auth";
import { getCollectiveById, } from "@/utils/collective";
import { NFTData } from "@/types";
import { ETH_CURRENCY_ADDRESS, HONEYPOT } from "@/utils/constants";



export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const user = await findUserByFid(Number(form.get("createdBy")))
    const collective = await getCollectiveById(Number(form.get("collectiveId")))
    if (user && collective) {

      const data = {
        name: (form.get("name") as string) || "",
        description: (form.get("description") as string) || "",
        imageFile: form.get("imageFile"),
        collectiveId: (form.get("collectiveId") as string) || "",
        price: (form.get("price") as string) || "",
        paymentCurrency: (form.get("paymentCurrency") as string) || "",
        decimal: (form.get("decimal") as string) || "",
        exchangeRateInEth: form.get("exchangeRateInEth"),
        createdBy: user.id
      };
      const { name, description, collectiveId, price, paymentCurrency, decimal, exchangeRateInEth } = data;

      let isErc20 = paymentCurrency !== ETH_CURRENCY_ADDRESS
      // Generate unique id for frame to not use the integer 
      const slug = uuidv4();

      //1 upload the nft metadata to vercel
      const ipfs = await pinFileToIPFS(data.imageFile, name, description);

      if (ipfs) {
        const tokenMetaData = {
          name,
          description,
          image: ipfs.ipfsImageUrl,
          imageURI: ipfs.ipfsImageUrl,
        };
        //2 upload the JSON metadatauri to vercel blob
        const { url: metaDataUri } = await put(
          "metadata_uri",
          JSON.stringify(tokenMetaData),
          { access: "public" }
        );


        const exchangeRate = Number(price) * Number(exchangeRateInEth)
        console.log(exchangeRate, 'what is exchange rate?', paymentCurrency, exchangeRateInEth,)
        const nftData: NFTData = {
          name,
          pricePerMintETH: isErc20 ? exchangeRate.toFixed(2) : price,
          pricePerMintToken: isErc20 ? price : undefined,
          tokenMetaDataUri: metaDataUri,
          creator: user.walletAddress as `0x${string}`,
          paymentCurrency: paymentCurrency as `0x${string}`,
        }
        //3) create the erc1155 using Liq Operator account as sponsor + Zora SDK
        const nft = await create1155Contract(
          collective.cAddress as `0x${string}`, HONEYPOT, nftData
        );

        if (nft) {
          //4) add new created nft mint frame to db so we can track
          const newFrame = await db
            .insert(frame)
            .values({
              name,
              slug,
              imageUrl: ipfs.ipfsGatewayUrl,
              description,
              collectiveId: Number(collectiveId),
              metaDataUrl: metaDataUri,
              tokenId: 1, //always 1 after creating new erc1155 contract with zora
              nftTokenAddress: nft.nftContractAddress,
              paymentCurrency: paymentCurrency,
              decimal: Number(decimal),
              priceInToken: price,
              createdBy: user?.id,
            })
            .returning();
          return NextResponse.json({
            frame: newFrame[0],
            zoraUrl: `https://zora.co/collect/base:${nft.nftContractAddress}/1`,
          });
        } else { throw Error("NFT failed to be created using Zora SDK") }

      } else { throw Error("Failed to upload NFT to IPFS") }

    } else { throw Error("Failed to find user by fid: " + form.get("createdBy")) }

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: NextRequest, response: NextResponse) {
  const fid = request.cookies.get(COOKIE_USER_FID)?.value;
  if (fid) {
    const users = await db.select().from(user).where(eq(user.fid, Number(fid))).limit(1);
    if (users && users.length > 0) {

      const res = await db.select().from(frame).where(and(
        eq(frame.createdBy, users[0].id),
        eq(frame.createdBy, users[0].id)
      ));

      return Response.json(res || []);
    }

    return NextResponse.json({ fid });
  }
}
