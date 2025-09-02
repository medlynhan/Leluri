import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!supabaseUrl) {
  throw new Error('Supabase URL must be provided in .env');
}

console.log(supabaseUrl.replace(/^https?:\/\//, ''))

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseUrl.replace(/^https?:\/\//, '').replace(/^www\./, ''),
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
