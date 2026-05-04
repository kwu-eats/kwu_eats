import { extname } from 'path';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

export type UploadFolder = 'reports' | 'restaurants';

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly region: string;
  private readonly publicBaseUrl: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const forcePathStyle = this.config.get<boolean>('S3_FORCE_PATH_STYLE') === true;

    this.region =
      this.config.get<string>('S3_REGION') ??
      this.config.get<string>('AWS_REGION') ??
      'us-east-1';
    this.bucket =
      this.config.get<string>('S3_BUCKET') ??
      this.config.get<string>('AWS_S3_BUCKET')!;

    const accessKeyId =
      this.config.get<string>('S3_ACCESS_KEY') ??
      this.config.get<string>('AWS_ACCESS_KEY_ID')!;
    const secretAccessKey =
      this.config.get<string>('S3_SECRET_KEY') ??
      this.config.get<string>('AWS_SECRET_ACCESS_KEY')!;

    this.s3 = new S3Client({
      region: this.region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: { accessKeyId, secretAccessKey },
    });

    this.publicBaseUrl = (this.config.get<string>('PUBLIC_IMAGE_BASE_URL') ?? '').replace(/\/$/, '');
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: UploadFolder,
  ): Promise<{ url: string; key: string }> {
    const ext = extname(file.originalname).toLowerCase();
    const key = `pangchelin/${folder}/${uuidv4()}${ext}`;

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch {
      throw new InternalServerErrorException('이미지 업로드에 실패했습니다.');
    }

    // PUBLIC_IMAGE_BASE_URL 이 설정되면 그것을 사용 (DGX: '/uploads' 상대경로,
    // AWS+CloudFront: 'https://images.example.com'). 미설정 시 AWS S3 절대 URL 폴백.
    const url = this.publicBaseUrl
      ? `${this.publicBaseUrl}/${key}`
      : `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    return { url, key };
  }
}
