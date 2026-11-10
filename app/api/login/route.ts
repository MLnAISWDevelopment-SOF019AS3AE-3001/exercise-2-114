import {
  accessCookieName,
  accessToken,
  coursePassword,
  safeEqual,
} from "@/lib/course-access";
import { redirectTo } from "@/lib/redirect";

export async function POST(request: Request) {
  const password = coursePassword();
  if (!password) {
    return redirectTo(request, "/login?error=unconfigured");
  }

  const form = await request.formData();
  const given = String(form.get("password") ?? "");
  if (!safeEqual(given, password)) {
    return redirectTo(request, "/login?error=1");
  }

  const response = redirectTo(request, "/rag");
  response.cookies.set(accessCookieName(), await accessToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
