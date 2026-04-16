import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    domains: ["res.cloudinary.com", "firebasestorage.googleapis.com"],
  },
};

export default nextConfig;
