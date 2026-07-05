import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self' https: data: blob:; " +
      "script-src 'self' 'unsafe-inline' https://stats.verterelabs.co.za; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data: https:; " +
      "connect-src 'self' https:; " +
      "frame-ancestors 'self'; " +
      "base-uri 'self'; " +
      "form-action 'self';",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

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
  trailingSlash: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
      {
        source: "/pdfs/ifrs-16-leases.pdf",
        headers: [
          {
            key: "Link",
            value: '<https://accetutors.co.za/pdfs/ifrs-16-leases.pdf>; rel="canonical"',
          },
        ],
      },
      {
        source: "/pdfs/groups-business-combinations.pdf",
        headers: [
          {
            key: "Link",
            value: '<https://accetutors.co.za/pdfs/groups-business-combinations.pdf>; rel="canonical"',
          },
        ],
      },
      {
        source: "/pdfs/ifrs-15-revenue.pdf",
        headers: [
          {
            key: "Link",
            value: '<https://accetutors.co.za/pdfs/ifrs-15-revenue.pdf>; rel="canonical"',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

