import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // SVGアイコンと画像最適化の設定
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
