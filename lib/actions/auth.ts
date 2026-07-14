"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  API_BASE_URL,
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from "@/lib/config";
import { fetchWithTimeout } from "@/lib/fetchWithTimeout";
import { getErrorMessage } from "@/lib/utils";
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

export async function loginAction(
  data: LoginRequest,
): Promise<{ error?: string }> {
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
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
  } catch (err) {
    return { error: getErrorMessage(err) };
  }
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
  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err.error?.message ?? "Registration failed" };
    }

    return loginAction({ email: data.email, password: data.password });
  } catch (err) {
    return { error: getErrorMessage(err) };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(ACCESS_TOKEN_COOKIE)?.value;
  if (!token) return null;

  try {
    const res = await fetchWithTimeout(`${API_BASE_URL}/api/auth/me/`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
