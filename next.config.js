// ============================================================
// FILE: next.config.js
// PURPOSE: Next.js build configuration for ForgeYours tools
// LAST CHANGED: 11 Jun 2026
// WHY IT EXISTS: Required by Next.js — configures PWA, image
//               domains, and security headers for all tools
// DEPENDENCIES: None
// ⚠️ DO NOT CHANGE: never upgrade next to v15
//                   never remove PWA config — offline is required
//                   never remove security headers
// ============================================================

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);

// --- CHANGE LOG ---
// [11 Jun 2026] CREATED: Initial tool template
// REASON: Base Next.js config with PWA wrapper for ForgeYours tools
// --- END CHANGE LOG ---
