/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['portfolio202025.netlify.app', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // For Netlify deployment
  },
  async redirects() {
    return [
      // Redirect from login page during build to prevent Firebase errors
      process.env.NODE_ENV === 'production'
        ? {
            source: '/login',
            destination: '/',
            permanent: false,
          }
        : null,
      process.env.NODE_ENV === 'production'
        ? {
            source: '/admin',
            destination: '/',
            permanent: false,
          }
        : null,
    ].filter(Boolean);
  },
};

export default nextConfig;
