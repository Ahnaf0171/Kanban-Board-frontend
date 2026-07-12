import { getErrorMessage } from "@/lib/utils";
import type { ApiErrorResponse } from "@/types/types";

const BASE_URL = "/api/proxy";

export class ApiError extends Error {
  status: number;
  details?: Record<string, string>;
  constructor(
    message: string,
    status: number,
    details?: Record<string, string>,
  ) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

type Query = Record<string, string | number | undefined>;

function buildUrl(path: string, query?: Query) {
  if (!query) return `${BASE_URL}${path}`;
  const params = new URLSearchParams();
  Object.entries(query).forEach(
    ([k, v]) => v !== undefined && params.set(k, String(v)),
  );
  const qs = params.toString();
  return qs ? `${BASE_URL}${path}?${qs}` : `${BASE_URL}${path}`;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  query?: Query,
): Promise<T> {
  const isFormData = init.body instanceof FormData;

  const res = await fetch(buildUrl(path, query), {
    ...init,
    headers: isFormData
      ? init.headers
      : { "Content-Type": "application/json", ...init.headers },
  });

  if (res.status === 204) return undefined as T;

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const err = data as ApiErrorResponse | null;
    throw new ApiError(
      err?.error?.message ?? getErrorMessage(data),
      res.status,
      err?.error?.details,
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, query?: Query) =>
    request<T>(path, { method: "GET" }, query),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => request<void>(path, { method: "DELETE" }),
};
