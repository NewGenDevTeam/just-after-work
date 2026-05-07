/** @type {import('next').NextConfig} */
const nextConfig = {
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
      // Add your WordPress hostname here once deployed
      // { protocol: 'https', hostname: 'cms.yourdomain.com' },
    ],
  },
};

export default nextConfig;
