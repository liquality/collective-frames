import { NextRequest, NextResponse } from "next/server";
import { Auth } from "./utils/cookie-auth";

export default function middleware(req: NextRequest) {
    let verify = Auth.getUser.userFid;
    let url = req.url;

    if (verify && url === 'http://localhost:3000/api/collectives') {
        return NextResponse.redirect("http://localhost:3000/home");

    }

    return null;
}