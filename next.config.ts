/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ['portfolio202025.netlify.app', 'localhost'],
    unoptimized: process.env.NODE_ENV === 'production', // For Netlify deployment
  },
  // Only use redirects during the build process, not in runtime
  async redirects() {
    // Check if it's the build process using an environment variable
    const isBuildTime = process.env.NETLIFY === 'true' && process.env.CONTEXT === 'production' && process.env.BUILD_STEP === 'true';
    
    if (isBuildTime) {
      return [
        {
          source: '/login',
          destination: '/',
          permanent: false,
        },
        {
          source: '/admin',
          destination: '/',
          permanent: false,
        },
      ];
    }
    
    // Return empty array for normal operation
    return [];
  },
};

export default nextConfig;
