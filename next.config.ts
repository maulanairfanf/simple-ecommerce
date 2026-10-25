import type { NextConfig } from "next";

const apiBaseUrl =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  experimental: {
    agentUpgrade: "security",
  },
  async rewrites() {
    return [{ source: "/api/backend/:path*", destination: `${apiBaseUrl}/:path*` }];
  },
};

export default nextConfig;
