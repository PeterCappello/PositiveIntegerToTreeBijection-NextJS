/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/PositiveIntegerToTreeBijection-NextJS',
  unoptimizedImages: true,
  // Disable static optimization for GitHub Pages
  trailingSlash: true,
};

module.exports = nextConfig;
