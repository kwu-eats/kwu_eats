import Joi = require('joi');

/**
 * 환경 변수 스키마.
 *
 * - NODE_ENV: production / development / test
 * - JWT_EXPIRES_IN: '7d' / '1h' 같은 ms 표현 (기본 1d — 운영 안전 기본값)
 * - AWS_*: S3 업로드 기능 사용 시에만 필수. 미사용 시 비워두면 됨 → 운영 코드에서 분기.
 *   (EC2 단독 배포 / S3 미사용 케이스를 위해 optional 로 완화)
 * - CORS_ORIGIN: 쉼표 구분 multiple origin 가능 — main.ts 에서 split.
 *   URI 검증을 강제하지 않고 string 으로 받아 multiple origin 지원.
 */
export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),

  // 인증
  JWT_SECRET: Joi.string().min(16).required(),
  // 1d, 1h, 30m, 7d, 2w 등 ms 표현. 1y 같은 과도한 값은 보안 정책상 금지.
  JWT_EXPIRES_IN: Joi.string()
    .pattern(/^\d+(s|m|h|d|w)$/i)
    .default('1d'),

  // 서버
  PORT: Joi.number().port().default(4000),
  CORS_ORIGIN: Joi.string().required(),

  // AWS S3 (선택 — S3 업로드 기능 켤 때만 채움)
  AWS_REGION: Joi.string().optional().allow(''),
  AWS_ACCESS_KEY_ID: Joi.string().optional().allow(''),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
  AWS_S3_BUCKET: Joi.string().optional().allow(''),

  // 로깅
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'log', 'debug', 'verbose')
    .default('log'),
}).unknown(true);
