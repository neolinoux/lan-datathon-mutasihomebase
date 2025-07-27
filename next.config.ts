import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Skip TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable experimental typed routes
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
