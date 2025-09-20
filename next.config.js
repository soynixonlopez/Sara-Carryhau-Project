/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  // Completely disable build tracing to prevent micromatch stack overflow
  experimental: {
    outputFileTracingRoot: undefined,
    outputFileTracingExcludes: {
      '*': [
        '**/node_modules/**/*',
        '**/.git/**/*',
        '**/.next/**/*',
        '**/scripts/**/*',
        '**/cloudinary-images.json',
      ],
    },
  },
  // Use standalone output with minimal tracing
  output: 'standalone',
  trailingSlash: false,
  // Simple build ID to avoid complexity
  generateBuildId: () => 'build-' + Math.random().toString(36).substr(2, 9),
}

module.exports = nextConfig