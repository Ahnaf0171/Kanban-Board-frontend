const DEFAULT_TIMEOUT_MS = 60_000;

export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  try {
    return await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error(
        "The server is taking longer than usual to start up. Please try again in a moment.",
      );
    }
    throw new Error(
      "Could not reach the server. Please check your connection and try again.",
    );
  }
}
