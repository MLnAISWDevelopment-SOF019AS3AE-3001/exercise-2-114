import { accessCookieName } from "@/lib/course-access";
import { redirectTo } from "@/lib/redirect";

export async function POST(request: Request) {
  const response = redirectTo(request, "/login");
  response.cookies.set(accessCookieName(), "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
