import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Don't advertise the framework version via `X-Powered-By` (hardening).
  poweredByHeader: false,
};

export default nextConfig;
