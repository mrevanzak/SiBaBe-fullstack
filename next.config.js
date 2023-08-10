/** @type {import('next').NextConfig} */
module.exports = {
  eslint: {
    dirs: ['src'],
  },

  reactStrictMode: true,

  // Uncoment to add domain whitelist
  images: {
    domains: ['i.ibb.co'],
  },

  // SVGR
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            typescript: true,
            icon: true,
          },
        },
      ],
    });

    return config;
  },

  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV,
    BACKEND_URL: process.env.BACKEND_URL,
    STORAGE_URL: process.env.STORAGE_URL,
    STORAGE_KEY: process.env.STORAGE_KEY,
  },
};
