import Joi = require('joi');

// AWS S3(운영)와 자체 호스팅 MinIO(DGX 임시) 두 시나리오를 같은 코드로 지원.
// - AWS 시나리오: AWS_REGION/AWS_S3_BUCKET/AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY 사용
// - DGX 시나리오: S3_ENDPOINT + S3_BUCKET + S3_ACCESS_KEY + S3_SECRET_KEY 사용
// 둘 중 한 세트는 반드시 채워져 있어야 함.
export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  PORT: Joi.number().port().default(4000),
  CORS_ORIGIN: Joi.string().uri().required(),

  // S3 호환 (DGX/MinIO 우선). 셋 중 하나라도 있으면 모두 채워야 함.
  S3_ENDPOINT: Joi.string().uri().optional(),
  S3_REGION: Joi.string().min(1).optional(),
  S3_ACCESS_KEY: Joi.string().min(1).optional(),
  S3_SECRET_KEY: Joi.string().min(1).optional(),
  S3_BUCKET: Joi.string().min(1).optional(),
  S3_FORCE_PATH_STYLE: Joi.boolean().truthy('true').falsy('false').default(false),

  // AWS S3 (운영용 폴백). S3_* 가 없으면 AWS_* 가 필수.
  AWS_REGION: Joi.string().min(1).optional(),
  AWS_ACCESS_KEY_ID: Joi.string().min(1).optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().min(1).optional(),
  AWS_S3_BUCKET: Joi.string().min(1).optional(),

  // 공개 이미지 URL 베이스. DGX 에서는 '/uploads' 같은 상대경로,
  // AWS 에서는 비어있거나 CloudFront 절대 URL.
  PUBLIC_IMAGE_BASE_URL: Joi.string().allow('').optional(),
}).custom((value, helpers) => {
  const hasS3 = value.S3_BUCKET && value.S3_ACCESS_KEY && value.S3_SECRET_KEY;
  const hasAws = value.AWS_S3_BUCKET && value.AWS_ACCESS_KEY_ID && value.AWS_SECRET_ACCESS_KEY && value.AWS_REGION;
  if (!hasS3 && !hasAws) {
    return helpers.error('any.invalid', {
      message: 'S3_* (DGX) 또는 AWS_* (운영) 환경변수 한 세트는 반드시 설정해야 합니다.',
    });
  }
  return value;
});
