import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.GITHUB_ACTIONS ? '/explorando' : '',
  /* config options here */
};

export default nextConfig;
