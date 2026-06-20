/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  // 🎯 ইমেজ হোস্ট কনফিগারেশন এখানে যোগ করা হলো
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ইমগবিবি (ইউজার অ্যাভাটার) এর জন্য
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com', // আনস্প্ল্যাশ (রেসিপি/হিরো ইমেজ) এর জন্য
      },
      { protocol: 'https',
         hostname: 'ui-avatars.com' },
    ],
  },
};

export default nextConfig;