const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@cakify/ui", "@cakify/types"],
  experimental: {
    typedRoutes: true
  }
};

module.exports = nextConfig;
