import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const role = req.cookies.get("role")?.value;

  const pathname = req.nextUrl.pathname;

  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/customer") && role !== "customer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.startsWith("/team") && role !== "team") {
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/customer/:path*", "/team/:path*"],
};
