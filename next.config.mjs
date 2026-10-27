const security = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=()' },
]

// Public assets keep their names between deploys, so they get a day fresh and a week of stale-while-revalidate
const assets = [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }]

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@react-pdf/renderer'],
  experimental: { agentUpgrade: 'latest' },
  // A redirect, not a rewrite, so the pdf has one URL
  redirects: async () => [{ source: '/resume', destination: '/resume.pdf', permanent: true }],
  headers: async () => [
    { source: '/:path*', headers: security },
    ...['/icons/:path*', '/games/:path*', '/posters/:path*', '/avatar.jpg'].map((source) => ({
      source,
      headers: assets,
    })),
  ],
}

export default nextConfig
