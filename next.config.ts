import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'malik-backend-orht.onrender.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
