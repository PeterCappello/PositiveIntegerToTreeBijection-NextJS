/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // Allow build to succeed even with TypeScript errors
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
