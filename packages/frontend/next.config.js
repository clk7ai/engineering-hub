/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Image optimization
  images: {
    domains: [
      'localhost',
      'interestingengineering.com',
      'images.unsplash.com',
      'cdn.pixabay.com'
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  },

  // API proxy to avoid CORS issues in development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.BACKEND_URL || 'http://localhost:5000/api/:path*',
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Add support for path aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': __dirname + '/src',
      '@shared': __dirname + '/../shared/src',
    };

    return config;
  },

  // Experimental features
  experimental: {
    // Enable App Router features
    appDir: true,
  },

  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Headers for security
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
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
