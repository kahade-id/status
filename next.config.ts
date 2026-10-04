import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@kahade/ui"],
  async headers() {
    // Security headers. CSP sengaja TIDAK dipasang di sini (ditunda, berisiko
    // merusak inline script) — keputusan audit batch 1-3.
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
