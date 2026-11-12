/**
 * Thin wrapper around fetch for the Express API server.
 * - Uses the same-origin Next.js API proxy
 * - Sends the httpOnly JWT cookie with every request
 */
interface ApiResult<T = unknown> {
  ok: boolean;
  status: number;
  data: T | null;
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  return fetch(path, {
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
