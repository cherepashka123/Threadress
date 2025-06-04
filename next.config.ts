/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Enable static exports for better performance
  output: 'standalone',
};

export default nextConfig;
