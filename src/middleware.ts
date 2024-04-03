import { NextRequest, NextResponse } from "next/server";
import { Auth } from "./utils/cookie-auth";
export default function middleware(req: NextRequest) {
    let verify = Auth.getUser.signerUuid;
    let url = req.url;

    console.log(verify, 'verified cookie token')
    console.log(url, 'wats url exact?')

    if (verify && url === 'http://localhost:3000/api/collectives') {
        return NextResponse.redirect("http://localhost:3000/home");

    }

    return null;
}