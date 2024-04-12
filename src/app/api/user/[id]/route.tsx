import { NextRequest, NextResponse } from "next/server";
import { findUserByFid } from "@/utils/user";

export async function GET(request: NextRequest) {
  const parts = request.url.split("/");
  const id = parts[parts.length - 1];
  const res = await findUserByFid(Number(id));
  return Response.json(res);
}
