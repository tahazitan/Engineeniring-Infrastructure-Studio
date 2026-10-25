import type { NextConfig } from 'next';
const nextConfig: NextConfig = { reactStrictMode: true, distDir: process.env.STUDIO_NEXT_DIST_DIR || '.next', devIndicators: false, outputFileTracingRoot: process.cwd(), output: process.env.STUDIO_MODE === 'public' ? 'standalone' : undefined };
export default nextConfig;
