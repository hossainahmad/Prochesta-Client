/**
 * Thin wrapper around fetch for the Express API server.
 * - Prefixes every path with the API base URL (NEXT_PUBLIC_API_URL)
 * - Always sends cookies so the httpOnly JWT reaches the server
 */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://prochesta-server.vercel.app/";

interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...init,
  });
}

export async function apiJson<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await apiFetch<T>(path, init);
    const data = (await res.json().catch(() => null)) as T | null;
    return { ok: res.ok, status: res.status, data };
  } catch {
    return { ok: false, status: 0, data: null };
  }
}
