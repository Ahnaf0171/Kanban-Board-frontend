import { NextRequest, NextResponse } from "next/server";
import {
  API_BASE_URL,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/config";

const METHODS = ["GET", "POST", "PATCH", "DELETE"] as const;
type Method = (typeof METHODS)[number];

async function forward(
  req: NextRequest,
  method: Method,
  path: string[],
  accessToken?: string,
) {
  const url = `${API_BASE_URL}/api/${path.join("/")}/${req.nextUrl.search}`;
  const contentType = req.headers.get("content-type") ?? undefined;

  const hasBody = method === "POST" || method === "PATCH";
  const body = hasBody ? await req.arrayBuffer() : undefined;

  return fetch(url, {
    method,
    headers: {
      ...(contentType ? { "Content-Type": contentType } : {}),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: body && body.byteLength > 0 ? body : undefined,
  });
}

async function refreshAccessToken(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) return null;
  return (await res.json()) as { access: string; refresh: string };
}

function withAuthCookies(res: NextResponse, access: string, refresh: string) {
  const opts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
  };
  res.cookies.set(ACCESS_TOKEN_COOKIE, access, opts);
  res.cookies.set(REFRESH_TOKEN_COOKIE, refresh, opts);
  return res;
}

async function toNextResponse(upstream: Response) {
  if (upstream.status === 204) return new NextResponse(null, { status: 204 });
  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const method = req.method as Method;
  const { path } = await params;
  const accessToken = req.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_TOKEN_COOKIE)?.value;

  let upstream = await forward(req, method, path, accessToken);

  if (upstream.status === 401 && refreshToken) {
    const rotated = await refreshAccessToken(refreshToken);
    if (!rotated) return new NextResponse(null, { status: 401 });

    upstream = await forward(req, method, path, rotated.access);
    const res = await toNextResponse(upstream);
    return withAuthCookies(res, rotated.access, rotated.refresh);
  }

  return toNextResponse(upstream);
}

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const DELETE = handler;
