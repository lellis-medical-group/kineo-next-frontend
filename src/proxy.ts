import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

export async function proxy(request: NextRequest) {
  try {
    const sessionResponse = await fetch(`${BACKEND_URL}/api/auth/get-session`, {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    });

    if (!sessionResponse.ok) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    const { data: session } = await sessionResponse.json();

    if (!session) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Auth proxy error:", error);
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}

export const config = {
  matcher: ["/dashboard", "/profile", "/settings"],
};
