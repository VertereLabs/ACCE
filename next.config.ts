import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',  // Creates a self-contained Node.js server
  reactCompiler: true,
  images: {
    unoptimized: true, // Keep for compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Trailing slashes help with static hosting routing
  trailingSlash: true,
};

export default nextConfig;

