import { defineConfig } from "next";

export default defineConfig({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "mercur-connect.s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "api.mercurjs.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "api-sandbox.mercurjs.com",
        pathname: "/static/**",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "s3.eu-central-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "blkmrktbucket.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "freeblackmarket.up.railway.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ibis.up.railway.app",
        pathname: "/**",
      },
    ],
  },
});
