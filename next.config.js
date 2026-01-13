/** @type {import('next').NextConfig} */
const path = require('path');
const webpack = require('webpack');

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Enable experimental features if needed
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  webpack: (config) => {
    // Handle figma:asset/ imports by replacing them with actual asset paths
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^figma:asset\/(.+)$/,
        (resource) => {
          const match = resource.request.match(/^figma:asset\/(.+)$/);
          if (match) {
            resource.request = path.resolve(__dirname, 'assets', match[1]);
          }
        }
      )
    );
    return config;
  },
  // Turbopack config - empty to silence warning when using webpack
  // When using --webpack flag, this config is ignored
  turbopack: {},
}

module.exports = nextConfig
