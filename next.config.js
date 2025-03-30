/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'example.com'], // Add your image domains here
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig 