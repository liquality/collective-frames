import { NextRequest, NextResponse } from "next/server";
import { findFrameById } from "@/utils/frame";


export async function GET(request: NextRequest) {
  const id = request
  console.log(request, 'what is request?')
  // TODO: add filter by user if it's auth or have two routes to list global frames created or filter by user
  const res = await findFrameById(23);
  return Response.json(res);
}
