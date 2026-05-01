/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션 Docker 이미지 크기 최소화: 최소 의존성만 묶인 standalone server.js 출력
  output: 'standalone',
  // 모노레포에서 standalone 추적 루트 (workspace 루트)
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // S3 업로드 이미지 (운영). 버킷명/리전 변경 시 함께 수정.
      {
        protocol: 'https',
        hostname: '*.s3.ap-northeast-2.amazonaws.com',
      },
      // CloudFront 배포 도메인 (배포 후 실제 도메인으로 교체)
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
      },
    ],
  },
  transpilePackages: ['@pangchelin/types'],
};

module.exports = nextConfig;
