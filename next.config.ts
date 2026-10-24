import type { NextConfig } from 'next';
const nextConfig: NextConfig = { reactStrictMode: true, output: process.env.STUDIO_MODE === 'public' ? 'standalone' : undefined };
export default nextConfig;
