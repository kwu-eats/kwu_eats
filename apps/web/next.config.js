/** @type {import('next').NextConfig} */
const nextConfig = {
  // 프로덕션 Docker 이미지 크기 최소화: 최소 의존성만 묶인 standalone server.js 출력
  output: 'standalone',
  // 모노레포에서 standalone 추적 루트 (workspace 루트)
  outputFileTracingRoot: require('path').join(__dirname, '../../'),
  images: {
    // DGX(자체 호스팅 + nginx /uploads/* → minio) 에서는 next/image 의
    // 최적화 라우트가 외부 이미지에 도메인 화이트리스트를 요구. 상대경로
    // /uploads/* 는 same-origin 이라 별도 등록 불필요하지만, sharp 최적화는
    // DGX 컨테이너 안에서 실행되어야 하므로 standalone 출력에 sharp 포함됨.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // S3 업로드 이미지 (AWS 운영). 버킷명/리전 변경 시 함께 수정.
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
