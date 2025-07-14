import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // アイコンファイルの最適化設定
    deviceSizes: [32, 48, 64, 96, 128],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp', 'image/png'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // 開発時のデバッグ情報
  experimental: {
    optimizeCss: false, // 開発時のCSS最適化を無効にしてデバッグしやすくする
  },
  // 静的アセットの設定
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
};

export default nextConfig;
