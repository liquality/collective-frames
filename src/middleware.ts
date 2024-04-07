import { NextRequest, NextResponse } from "next/server";
import { Auth } from "./utils/cookie-auth";

export default function middleware(req: NextRequest) {
    let verify = Auth.getUser.userFid;
    let url = req.url;

    if (verify && url === `${process.env.NEXT_PUBLIC_SERVER_URL}api/collectives`) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}home`);

    }

    return null;
}