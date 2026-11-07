import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/create-event", "/manage-events", "/joined-events", "/profile"];
const AUTH_PAGES = ["/login", "/register"];

/**
 * Route protection via the JWT the Express API sets in the `auth_token`
 * cookie. Verified locally (HS256) so no network call is needed.
 */
async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return false;

  const secretValue = process.env.AUTH_TOKEN_SECRET;
  if (!secretValue) return false;

  try {
    await jwtVerify(token, new TextEncoder().encode(secretValue));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const authenticated = await isAuthenticated(req);

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Private/protected routes → redirect to login with callback
  if (isProtected && !authenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Already authenticated → keep users away from login/register pages
  if (AUTH_PAGES.includes(pathname) && authenticated) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/create-event",
    "/manage-events",
    "/joined-events",
    "/profile",
    "/login",
    "/register",
  ],
};
