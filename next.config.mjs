/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  serverExternalPackages: ['@react-pdf/renderer'],
  rewrites: async () => [{ source: '/resume', destination: '/resume.pdf' }],
}

export default nextConfig
