import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  output: 'export',
  // Ensure this matches what you use in your components
  basePath: isProd ? '/explorando' : '', 
  assetPrefix: isProd ? '/explorando/' : '',
  images: {
    loader: 'custom',
    loaderFile: './utils/image-loader.ts', // Path to the file we created above
  },
};

export default nextConfig;
