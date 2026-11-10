import {
  accessCookieName,
  accessToken,
  coursePassword,
  safeEqual,
} from "@/lib/course-access";
import { redirectTo } from "@/lib/redirect";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function hasBody(method: string): boolean {
  return method !== "GET" && method !== "HEAD";
}

function isPublic(pathname: string): boolean {
  return (
    pathname === "/login" ||
    pathname === "/api/login" ||
    pathname === "/api/logout" ||
    pathname === "/api/health"
  );
}

function loginRedirect(request: NextRequest, error?: string): NextResponse {
  const path = error ? `/login?error=${error}` : "/login";
  return redirectTo(request, path);
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const password = coursePassword();

  if (!isPublic(pathname)) {
    if (!password) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { detail: "Course password is not configured." },
          { status: 503 },
        );
      }
      return loginRedirect(request, "unconfigured");
    }
    const cookie = request.cookies.get(accessCookieName())?.value ?? "";
    const expected = await accessToken(password);
    if (!safeEqual(cookie, expected)) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json(
          { detail: "Course password required." },
          { status: 401 },
        );
      }
      return loginRedirect(request);
    }
  }

  // Login and logout are Next routes. /api/health is public and still proxied.
  if (
    !pathname.startsWith("/api") ||
    pathname === "/api/login" ||
    pathname === "/api/logout"
  ) {
    return NextResponse.next();
  }

  const backendPath = pathname.replace(/^\/api/, "") || "/";
  const targetUrl = `${BACKEND_URL}${backendPath}${request.nextUrl.search}`;
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  if (password) headers.set("x-course-password", password);

  try {
    let body: ArrayBuffer | null = null;
    if (hasBody(request.method)) {
      body = await request.arrayBuffer();
      headers.set("content-length", body.byteLength.toString());
    }
    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
    });
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: new Headers(response.headers),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Proxy error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
