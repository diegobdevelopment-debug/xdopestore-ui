/** @type {import('next').NextConfig} */

const nextConfig = {
  env: {
    // Change below URL with your current domain
    API_PROD_URL: process.env.API_PROD_URL || "http://localhost:5000",
    storageURL: "",
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  }
};

export default nextConfig;
