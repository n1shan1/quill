import { config } from "process";
import { join } from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev, buildId, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

export default nextConfig;
