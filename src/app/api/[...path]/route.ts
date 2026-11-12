import { NextRequest } from "next/server";

const API_ORIGIN = (
  process.env.API_SERVER_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://prochesta-server.vercel.app"
).replace(/\/+$/, "");

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function forwardRequest(
  request: NextRequest,
  context: RouteContext,
): Promise<Response> {
  const { path } = await context.params;
  const upstreamUrl = new URL(
    `api/${path.map((segment) => encodeURIComponent(segment)).join("/")}`,
    `${API_ORIGIN}/`,
  );
  upstreamUrl.search = request.nextUrl.search;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete("connection");
  requestHeaders.delete("content-length");
  requestHeaders.delete("host");
  requestHeaders.delete("accept-encoding");

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(upstreamUrl, {
    method: request.method,
    headers: requestHeaders,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    redirect: "manual",
  });

  const responseHeaders = new Headers();
  upstream.headers.forEach((value, name) => {
    if (
      name.toLowerCase() !== "set-cookie" &&
      name.toLowerCase() !== "content-length" &&
      name.toLowerCase() !== "content-encoding" &&
      name.toLowerCase() !== "transfer-encoding"
    ) {
      responseHeaders.set(name, value);
    }
  });
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

export const GET = forwardRequest;
export const HEAD = forwardRequest;
export const POST = forwardRequest;
export const PUT = forwardRequest;
export const PATCH = forwardRequest;
export const DELETE = forwardRequest;
export const OPTIONS = forwardRequest;
