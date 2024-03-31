import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { slugify } from "@/utils";
import { db, frame } from "@/db";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();

    const data = {
      name: (form.get("name") as string) || "",
      description: (form.get("description") as string) || "",
      tokenAddress: (form.get("tokenAddress") as string) || "",
      imageFile: form.get("imageFile"),
    };

    const slug = slugify(data.name);
    const fileName = uuid();
    //1 create a blod
    const blob = await put(fileName, data.imageFile!, {
      access: "public",
    });

    const { name, description, tokenAddress } = data;
    const newFrame = await db
      .insert(frame)
      .values({
        name,
        slug,
        imageUrl: blob.url,
        tokenAddress,
        description,
        collectiveId: 1,
        createdBy: 1,
      })
      .returning();
      // TODO: integrate nft creation or put in a queue
    return NextResponse.json(newFrame[0]);
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
