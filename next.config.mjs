/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['@react-pdf/renderer'],
  rewrites: async () => [{ source: '/resume', destination: '/resume.pdf' }],
}

export default nextConfig
