import { NextRequest } from "next/server";
import { COOKIE_USER_FID } from "./utils/cookie-auth";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/frames")) {
    const session = request.cookies.get(COOKIE_USER_FID)?.value;
    if (session && request.nextUrl.pathname === "/") {
      return Response.redirect(new URL("/dashboard", request.url));
    }

    if (!session && ![ "/",  "/leaderboard"].includes(request.nextUrl.pathname) ) {
      return Response.redirect(new URL("/", request.url));
    }
  }

  return null;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.svg$).*)"],
};
