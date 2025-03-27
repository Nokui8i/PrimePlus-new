/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['picsum.photos', 'i.pravatar.cc', 'localhost', 'randomuser.me', 'ui-avatars.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*' // Updated to use port 3001
      }
    ];
  },
  // Performance optimizations
  poweredByHeader: false,
  distDir: '.next',
  typescript: {
    // Enable type checking for production builds
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    // Enable linting for production builds
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  }
};

module.exports = nextConfig;