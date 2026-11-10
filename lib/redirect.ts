import { NextResponse } from "next/server";
import { externalOrigin } from "./external-origin";

export function redirectTo(request: Request, path: string): NextResponse {
  const origin = externalOrigin(request.headers, request.url);
  if (!origin) {
    const response = new NextResponse(null, { status: 303 });
    response.headers.set("Location", path);
    return response;
  }
  return NextResponse.redirect(new URL(path, origin), 303);
}
