import { config } from "process";
import { join } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gravatar.com",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { dev, buildId, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Add rule for PDF worker files
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?m?js$/,
      type: "asset/resource",
      generator: {
        filename: "static/chunks/[name].[hash][ext]",
      },
    });

    return config;
  },
};

export default nextConfig;
