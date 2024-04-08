/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { db, frame } from "@/db";
import { eq } from "drizzle-orm";
import { createFrames, Button } from "frames.js/next";

const frames = createFrames({ basePath: "/frames" });
export const GET = frames(async (ctx) => {
  const parts = ctx.url.pathname.split("/");
  if (parts.length <= 2 || !parts[2]) {
    throw new Error("Frame id not found");
  }
  const slug = parts[2] || "";

  const data = await db
    .select()
    .from(frame)
    .where(eq(frame.slug, slug.toLowerCase()))
    .limit(1);
  const _frame = data ? data[0] : null;
  console.log({ data });

  return {
    image: <img src={_frame?.imageUrl || ""} alt={_frame?.name || ''}/>,
    buttons: [
      <Button
        action="post"
        target={{ pathname: `/${slug}`, query: { value: "MINT" } }}
      >
        MINT
      </Button>,
    ],
  };
});

export const POST = frames(async (ctx) => {
  const parts = ctx.url.pathname.split("/");
  if (parts.length <= 2 || !parts[2]) {
    throw new Error("Frame id not found");
  }
  const slug = parts[2] || "";

  const data = await db
    .select()
    .from(frame)
    .where(eq(frame.slug, slug))
    .limit(1);
  const _frame = data ? data[0] : null;

  console.log({ data });

  return {
    image: (
      <>
        <p>You Minted in {slug}</p>
        <span>Value: ${ctx.searchParams.value}</span>
      </>
    ),
    buttons: [],
  };
});
