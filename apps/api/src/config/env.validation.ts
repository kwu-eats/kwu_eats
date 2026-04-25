import Joi = require('joi');

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().uri({ scheme: ['postgresql', 'postgres'] }).required(),
  JWT_SECRET: Joi.string().min(16).required(),
  PORT: Joi.number().port().default(4000),
  CORS_ORIGIN: Joi.string().uri().required(),
  AWS_REGION: Joi.string().min(1).required(),
  AWS_ACCESS_KEY_ID: Joi.string().min(1).required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().min(1).required(),
  AWS_S3_BUCKET: Joi.string().min(1).required(),
});
