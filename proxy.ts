import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE } from "@/lib/config";

const PUBLIC_PATHS = [
  "/login",
  "/registration",
  "/about",
  "/features",
  "/pricing",
];

function isPublic(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function proxy(req: NextRequest) {
  const hasToken = req.cookies.has(ACCESS_TOKEN_COOKIE);
  const publicRoute = isPublic(req.nextUrl.pathname);

  if (!hasToken && !publicRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (
    hasToken &&
    (req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/registration")
  ) {
    return NextResponse.redirect(new URL("/tasks", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
