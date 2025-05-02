import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["local-origin.dev", "*.local-origin.dev"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "madeforhmns.com",
        pathname: "/cdn/shop/files/**",
      },
      {
        protocol: "https",
        hostname: "onixfragrance.co.id",
        pathname: "/cdn/shop/files/**",
      },
      {
        protocol: "https",
        hostname: "www.saffnco.com",
        pathname: "/_next/static/media/**",
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
