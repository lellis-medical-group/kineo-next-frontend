import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  poweredByHeader: false,
  cacheComponents: true,
  // Dev-only list of extra hosts allowed to open the dev server (e.g. your
  // phone on the LAN). Keep it out of source control via ALLOWED_DEV_ORIGINS.
  allowedDevOrigins: (process.env.ALLOWED_DEV_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  // /goodbye is a static page (○) whose URL carries a single-use deletion
  // token from the email link. Production would otherwise serve it with
  // `Cache-Control: s-maxage=31536000` (1-year CDN/shared cache): pin it to
  // no-store and never leak the token through the Referer or search engines.
  // `headers()` CAN override Cache-Control for pages (only SHA-hashed
  // immutable assets are locked, see next docs) — verified against `next start`.
  headers: async () => [
    {
      source: "/goodbye",
      headers: [
        { key: "Cache-Control", value: "no-store, max-age=0" },
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    },
  ],
};

export default nextConfig;
