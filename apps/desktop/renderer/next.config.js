/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['ui'],
  output: 'export',
  distDir: '../out/renderer',
};
