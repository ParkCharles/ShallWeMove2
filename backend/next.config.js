/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@mysten/sui', '@mysten/enoki'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...config.externals, '@mysten/sui', '@mysten/enoki'];
    }
    return config;
  },
}

module.exports = nextConfig 