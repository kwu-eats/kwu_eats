import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { SensitiveFieldsInterceptor } from './common/interceptors/sensitive-fields.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const isProduction = process.env.NODE_ENV === 'production';

  // Express x-powered-by 헤더 제거 — 프레임워크 정보 노출 방지 (ISMS-P 2.10.1)
  // Nginx 에서 proxy_hide_header 도 함께 적용해 다중 방어.
  app.disable('x-powered-by');

  // Helmet — 보안 헤더 추가 다중 방어. Nginx 가 1차 책임이지만 API 직접 노출 시도 대비.
  // contentSecurityPolicy 는 Nginx 의 것과 충돌 가능해 비활성 (Next.js 자산 차단 방지).
  // crossOriginEmbedderPolicy 는 카카오맵 SDK 와 호환성 이슈 있어 비활성.
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // CORS — 쉼표로 여러 origin 지원
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // 전역 예외 핸들러 — 응답 포맷 통일 + 스택 트레이스 차단 (production)
  app.useGlobalFilters(new AllExceptionsFilter());

  // 요청 로깅 + 민감 필드 마스킹
  app.useGlobalInterceptors(new SensitiveFieldsInterceptor());

  // Swagger — 운영에선 비공개 권장. 일단 켜두고 추후 토큰 보호 검토.
  if (!isProduction || process.env.SWAGGER_ENABLED === 'true') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('팡슐랭 API')
      .setDescription('광운대 맛집 추천 서비스 API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  // 운영에선 stdout 도 로그 시스템으로 수집되니 한국어 이모지 그대로 OK
  console.log(`🚀 API 서버 실행 중: http://localhost:${port}`);
  if (!isProduction) {
    console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
