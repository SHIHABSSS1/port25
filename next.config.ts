/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['portfolio202025.netlify.app', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // For Netlify deployment
  },
  // No redirects needed, allow all pages to be accessible
  async redirects() {
    // Return empty array for normal operation
    return [];
  },
};

export default nextConfig;
