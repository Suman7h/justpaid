import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
};
// next.config.js
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com','assets.aceternity.com','via.placeholder.com', ], // Add this line
  },
};

export default nextConfig;
