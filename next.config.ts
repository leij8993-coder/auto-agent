import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/auto-agent',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
