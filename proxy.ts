import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const PUBLIC_PATHS = ["/login", "/signup", "/"]; //app which are allowed without auth

export function proxy(req: NextRequest) {
  //will get url path
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next(); //->this will skip authentication
  }

  //access user cookies
  const token = req.cookies.get("token")?.value || "";

  //if no token we redirect user to signup or login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
    //url expects 2 parameters -> redirect route and base url from where user is making req from
  }

  try {
    //verify jwt
    jwt.verify(token, process.env.JWT_SECRET!);
    //PROCEED FURTHER
    return NextResponse.next();
  } catch (error) {
    console.error("Invalid token: ", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

//configure paths on which middleware runs
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/((?!api|_next/static|_next/image|.*\\.png$).*)", //exclude these routes
  ],
};
