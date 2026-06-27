/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', 
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co.com', 
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      { protocol: 'https',
         hostname: 'ui-avatars.com' },
    ],
  },
};

export default nextConfig;