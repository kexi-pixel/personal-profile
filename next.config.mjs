/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === "production";
const isVercel = process.env.VERCEL === "1";
const repoName = "personal-profile";
const useRepoBasePath = isProduction && !isVercel;

const nextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  basePath: useRepoBasePath ? `/${repoName}` : "",
  assetPrefix: useRepoBasePath ? `/${repoName}/` : undefined,
  trailingSlash: true,
};

export default nextConfig;
