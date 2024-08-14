/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: `https://info.poxa.io/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
