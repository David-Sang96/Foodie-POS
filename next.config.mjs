/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.vercel-storage.com", // * wildcard means anything
      },
    ],
  },
};

export default nextConfig;
