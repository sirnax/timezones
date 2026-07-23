import { withSerwist } from '@serwist/turbopack';

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  images: { unoptimized: true },
};

export default withSerwist(nextConfig);
