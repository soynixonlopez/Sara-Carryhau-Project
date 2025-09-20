/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  // Disable build tracing to prevent stack overflow
  output: 'standalone',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Disable webpack build analysis to prevent stack overflow
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      }
    }
    
    // Disable build tracing completely
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      }
    }
    
    return config
  },
  // Optimize build performance
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Disable static optimization that might cause issues
  trailingSlash: false,
}

module.exports = nextConfig