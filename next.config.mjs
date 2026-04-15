/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure trailing slashes for consistent URLs
  trailingSlash: false,
  // Enable strict mode for better error catching
  reactStrictMode: true,
  // Output as standalone for optimal Vercel performance
  output: 'standalone',
}

export default nextConfig
