import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
    ],
  },
  webpack: (config) => {
    // Fallbacks for Node-only modules to prevent build errors
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      crypto: false,
      module: false,
    };
    return config;
  },
};

export default nextConfig;
