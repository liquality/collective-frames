import { NextRequest, NextResponse } from "next/server";
export default function middleware(req: NextRequest) {
    //let verify = req.cookies.get("privy-token");
    let verify = true;
    let url = req.url;

    console.log(verify, 'verified cookie token')
    console.log(url, 'wats url exact?')

    console.log(verify && url === 'http://localhost:3000/api/collectives', 'T or F???', url === 'http://localhost:3000/api/collectives')
    if (verify && url === 'http://localhost:3000/api/collectives') { // Check if the user is on the homepage
        return NextResponse.redirect("http://localhost:3000/home");

    }

    return null;
}