import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

if (!supabaseUrl) {
  throw new Error('Supabase URL must be provided in .env');
}

const nextConfig: NextConfig = {
  images: {
    domains: [supabaseUrl.replace(/^https?:\/\//, '')],
  },
};

export default nextConfig;
