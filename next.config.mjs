/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  basePath: '',
  assetPrefix: '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
// serverPort: 8080, // Removed - use CLI flag
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
