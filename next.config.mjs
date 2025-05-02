// next.config.mjs
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import withBundleAnalyzer from "@next/bundle-analyzer";

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true", // Enable bundle analysis when ANALYZE=true
});

/** @type {import('next').NextConfig} */
const nextConfig = bundleAnalyzer({
  images: {
    domains: ["res.cloudinary.com"], // Specify image domains
  },

  // Enable JavaScript minification with SWC
  // swcMinify: true,

  // Enable experimental CSS optimization
  experimental: {
    optimizeCss: true,
  },

  webpack(config, { isServer }) {
    if (!isServer) {
      // Configure code splitting for client-side JavaScript
      config.optimization.splitChunks = {
        chunks: "all",
        minSize: 20000,
        maxSize: 240000, // Split chunk sizes for better caching
      };
    }

    // Add CSS minification for further compression
    config.optimization.minimizer.push(new CssMinimizerPlugin());

    return config;
  },
});

export default nextConfig;
