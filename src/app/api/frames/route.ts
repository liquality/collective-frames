import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { create1155Contract, pinFileToIPFS, slugify } from "@/utils";
import { db, frame } from "@/db";
import { findUserByFid } from "@/utils/user";

export async function POST(request: NextRequest) {
  try {

    const form = await request.formData();
    const user = await findUserByFid(form.get("createdBy") as unknown as number)
    const data = {
      name: (form.get("name") as string) || "",
      description: (form.get("description") as string) || "",
      imageFile: form.get("imageFile"),
      createdBy: user?.id
    };
    console.log({ data })
    const { name, description } = data;
    const slug = slugify(data.name);

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
        process.env.OPERATOR_ADDRESS,
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
            collectiveId: 1,
            metaDataUrl: metaDataUri,
            tokenId: 1, //always 1 after creating new erc1155 contract with zora
            tokenAddress: nft.logs[0].address,
            createdBy: 1, //TODO add get userId from db by selecting walletAddress/fid that is signed in with Neynar
          })
          .returning();
        return NextResponse.json({
          frame: newFrame[0],
          zoraUrl: `https://zora.co/collect/base:${nft.logs[0].address}/1`,
        });
      }
      return NextResponse.json(
        { error: "NFT failed to be created using Zora SDK" },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "Upload file failed" }, { status: 500 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  // TODO: add filter by user if it's auth or have two routes to list global frames created or filter by user
  const res = await db.select().from(frame);
  return Response.json(res);
}
