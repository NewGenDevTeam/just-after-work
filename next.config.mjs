/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  async redirects() {
    return [
      { source: "/news", destination: "/news-media", permanent: true },
      { source: "/news/:slug", destination: "/news-media/:slug", permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'justafterwork.com' },
      { protocol: 'https', hostname: '**.justafterwork.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
      { protocol: 'https', hostname: 'docker-image-production-ed6e.up.railway.app' },
    ],
  },
};

export default nextConfig;
