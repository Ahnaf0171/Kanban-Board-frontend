"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  API_BASE_URL,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/config";
import type {
  LoginRequest,
  AuthTokens,
  RegisterRequest,
  User,
} from "@/types/auth";
import type { ApiErrorResponse } from "@/types/common";

const cookieOpts = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 5,
  delayMs = 3000,
): Promise<Response> {
  try {
    return await fetch(url, options);
  } catch (err) {
    if (retries > 0) {
      console.warn(
        `fetch failed, retrying in ${delayMs}ms... (${retries} attempts left)`,
        err instanceof Error ? (err.cause ?? err.message) : err,
      );
      await new Promise((r) => setTimeout(r, delayMs));
      return fetchWithRetry(url, options, retries - 1, delayMs);
    }
    throw err;
  }
}

export async function loginAction(
  data: LoginRequest,
): Promise<{ error?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(45_000),
  });

  const body = await res.json();

  if (!res.ok) {
    const err = body as ApiErrorResponse;
    return { error: err.error?.message ?? "Invalid email or password" };
  }

  const { access, refresh } = body as AuthTokens;
  const store = await cookies();
  store.set(ACCESS_TOKEN_COOKIE, access, cookieOpts);
  store.set(REFRESH_TOKEN_COOKIE, refresh, cookieOpts);

  return {};
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ACCESS_TOKEN_COOKIE);
  store.delete(REFRESH_TOKEN_COOKIE);
  redirect("/");
}

export async function registerAction(
  data: RegisterRequest,
): Promise<{ error?: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(45_000),
  });

  if (!res.ok) {
    const err = await res.json();
    return { error: err.error?.message ?? "Registration failed" };
  }

  return loginAction({ email: data.email, password: data.password });
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  const res = await fetch(`${API_BASE_URL}/api/auth/me/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}
