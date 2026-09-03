import { type NextRequest, NextResponse } from "next/server";

/**
 * Middleware de garde : autorise si un cookie de session better-auth est
 * présent, redirige vers /signin sinon.
 *
 * On évite volontairement d'appeler le backend ici : le check repose sur le
 * même cookie posé par le client (`better-auth.*`), cohérent avec la session
 * côté navigateur. Quand le backend est momentanément indisponible, l'accès
 * n'est donc pas bloqué par erreur (l'état réel est vérifié côté client).
 */
export function proxy(request: NextRequest) {
  const hasSessionCookie = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("better-auth."));

  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
