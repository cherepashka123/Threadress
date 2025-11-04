/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'cdn.shopify.com',
      'www.manieredevoir.com',
      'manieredevoir.com',
      'rouje.com',
      'www.rouje.com',
      'withjean.com',
      'www.withjean.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.shopify.com',
      },
      {
        protocol: 'https',
        hostname: '**.manieredevoir.com',
      },
      {
        protocol: 'https',
        hostname: '**.rouje.com',
      },
      {
        protocol: 'https',
        hostname: '**.withjean.com',
      },
    ],
  },
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;
