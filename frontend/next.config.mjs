/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '8080' },
      { protocol: 'https', hostname: '**' }
    ]
  }
};

export default nextConfig;
