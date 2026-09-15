import type { NextConfig } from "next";

const backendUrl = new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");

const nextConfig: NextConfig = {
  transpilePackages: ["@pet-finder/shared"],
  images: {
    remotePatterns: [
      {
        protocol: backendUrl.protocol.replace(":", "") as "http" | "https",
        hostname: backendUrl.hostname,
        port: backendUrl.port || undefined,
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
