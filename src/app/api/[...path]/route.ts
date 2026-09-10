import { type NextRequest, NextResponse } from "next/server";

/**
 * Generic data proxy — mirrors the auth proxy so all backend calls stay
 * same-origin from the browser. The phone only ever talks to this Next.js app;
 * the backend is reached from the machine itself, so no CORS, no second port,
 * no hard-coded IP in the client bundle.
 *
 * /api/auth/* is handled by the more specific src/app/api/auth/[...all]/route.ts.
 */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

async function handleApiProxy(request: NextRequest) {
  // Strip the "/api" prefix: /api/profile/me -> /profile/me
  const path = request.nextUrl.pathname.replace(/^\/api/, "") || "/";
  const url = `${BACKEND_URL}${path}${request.nextUrl.search}`;

  const headers = new Headers(request.headers);
  headers.set("x-forwarded-host", request.nextUrl.host);
  headers.set("x-forwarded-proto", request.nextUrl.protocol.replace(":", ""));

  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    body = await request.arrayBuffer();
  }

  try {
    const response = await fetch(url, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
    });

    const responseHeaders = new Headers(response.headers);
    responseHeaders.delete("content-encoding");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "API service unavailable" },
      { status: 502 },
    );
  }
}

export const GET = handleApiProxy;
export const POST = handleApiProxy;
export const PUT = handleApiProxy;
export const DELETE = handleApiProxy;
export const PATCH = handleApiProxy;
