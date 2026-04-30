/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const repoName = "personal-profile";

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  basePath: isProduction ? `/${repoName}` : "",
  assetPrefix: isProduction ? `/${repoName}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;
