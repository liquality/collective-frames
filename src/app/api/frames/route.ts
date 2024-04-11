import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { create1155Contract, getETHMintPrice, mint, pinFileToIPFS } from "@/utils";
import { db, frame, user } from "@/db";
import { eq } from "drizzle-orm";
import { findUserByFid } from "@/utils/user";
import { v4 as uuidv4 } from 'uuid';
import { COOKIE_USER_FID } from "@/utils/cookie-auth";
import { getProvider } from "@/utils/collective";
import { ethers } from "ethers";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    console.log()
    const user = await findUserByFid(Number(form.get("createdBy")))

    console.log(user, 'what is user? FID:', Number(form.get("createdBy")))
    if (user) {

      const data = {
        name: (form.get("name") as string) || "",
        description: (form.get("description") as string) || "",
        imageFile: form.get("imageFile"),
        collectiveId: (form.get("collectiveId") as string) || "",
        createdBy: user?.id
      };
      console.log({ data })
      const { name, description, collectiveId } = data;
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
        //3) create the erc1155 using Liq Operator account as sponsor + Zora SDK
        const nft = await create1155Contract(
          metaDataUri,
          name
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
              tokenAddress: nft.logs[0].address,
              createdBy: user?.id,
            })
            .returning();
          return NextResponse.json({
            frame: newFrame[0],
            zoraUrl: `https://zora.co/collect/base:${nft.logs[0].address}/1`,
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

          const res = await db.select().from(frame).where(eq(frame.createdBy, users[0].id));

          return Response.json(res || []);
      }
    
      return NextResponse.json({ fid });
  }
}
