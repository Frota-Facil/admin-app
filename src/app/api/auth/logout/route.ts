import { type NextRequest, NextResponse } from "next/server";

function redirectUrl(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? "/login";
  const url = new URL(next, request.url);

  if (url.origin !== request.nextUrl.origin) {
    return new URL("/login", request.url);
  }

  return url;
}

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(redirectUrl(request));

  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
