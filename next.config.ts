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
  // Edge privacy for the account-deletion confirmation page: its URL carries
  // a single-use token from the email link, so it must never leak through the
  // Referer, never be cached by browsers/proxies, never be indexed.
  headers: async () => [
    {
      source: "/goodbye",
      headers: [
        { key: "Referrer-Policy", value: "no-referrer" },
        { key: "Cache-Control", value: "no-store, max-age=0" },
        { key: "X-Robots-Tag", value: "noindex, nofollow" },
      ],
    },
  ],
};

export default nextConfig;
