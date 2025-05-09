import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "4oi5i8w8pxe265os.public.blob.vercel-storage.com",
        pathname: "/perfume/**",
      },
    ],
  },
};

export default nextConfig;
