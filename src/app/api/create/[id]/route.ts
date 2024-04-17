import { NextRequest, NextResponse } from "next/server";
import { findFrameById } from "@/utils/frame";


export async function GET(request: NextRequest) {
  const parts = request.url.split('/');
  const id = parts[parts.length - 1];
  // TODO: add filter by user if it's auth or have two routes to list global frames created or filter by user
  const res = await findFrameById(Number(id));
  return Response.json(res);
}
