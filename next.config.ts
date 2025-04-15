/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['portfolio202025.netlify.app', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // For Netlify deployment
  },
  // Explicitly ensure no redirects for these critical pages
  async rewrites() {
    return [
      {
        source: '/login',
        destination: '/login',
      },
      {
        source: '/admin',
        destination: '/admin',
      },
    ];
  },
  // Empty redirects to avoid any automatic Next.js redirects
  async redirects() {
    return [];
  },
};

export default nextConfig;
