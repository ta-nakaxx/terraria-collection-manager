import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVGアイコンと画像最適化の設定
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Vercelでの最適化設定
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
};

export default nextConfig;
