/** @type {import('next').NextConfig} */

const nextConfig = {
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
