import type { NextConfig } from "next";

// 배포(빌드) 시에만 basePath 적용 → 로컬 개발(next dev)은 localhost:3000 그대로
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // GitHub Pages는 정적 호스팅 → HTML/CSS/JS로 뽑아냄
  output: "export",
  // GitHub Pages 주소가 /hospital-app/ 하위라 경로 맞춤
  basePath: isProd ? "/hospital-app" : "",
  // 중첩 경로 새로고침 404 방지 (out/경로/index.html 생성)
  trailingSlash: true,
  // 정적 환경에서는 이미지 최적화 서버가 없으므로 끔
  images: { unoptimized: true },
};

export default nextConfig;
