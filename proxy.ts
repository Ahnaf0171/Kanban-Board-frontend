import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/config";

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

function isExpired(token: string): boolean {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString(),
    );
    return typeof payload.exp === "number" && payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const hasValidToken = !!token && !isExpired(token);
  const publicRoute = isPublic(req.nextUrl.pathname);

  if (!hasValidToken && !publicRoute) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    if (token) {
      res.cookies.delete(ACCESS_TOKEN_COOKIE);
      res.cookies.delete(REFRESH_TOKEN_COOKIE);
    }
    return res;
  }
  if (
    hasValidToken &&
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
