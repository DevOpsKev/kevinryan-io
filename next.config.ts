import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static HTML export
  output: 'export',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Set base path if deploying to a repo subdirectory (e.g., https://username.github.io/repo-name/)
  // Remove or comment out if deploying to root domain (e.g., https://username.github.io/)
  basePath: '/kevinryan-io',

  // Ensure trailing slashes for GitHub Pages compatibility
  trailingSlash: true,

  // Optimize production build
  reactStrictMode: true,

  // Compression and optimization
  compress: true,

  // Production-grade security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
};

export default nextConfig;
