import { createMDX } from 'fumadocs-mdx/next';
import bundleAnalyzer from '@next/bundle-analyzer';

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    optimizePackageImports: ['fumadocs-ui', 'fumadocs-core'],
  },
};

export default withBundleAnalyzer(withMDX(config));
