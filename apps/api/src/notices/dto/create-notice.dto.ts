import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NoticeCategory } from '@prisma/client';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ example: '5월 신메뉴 업데이트', description: '제목' })
  @IsString()
  @MinLength(1, { message: '제목을 입력해주세요' })
  @MaxLength(200)
  title: string;

  @ApiProperty({
    example: '## 새로 추가된 식당\n- 우이천 김밥...',
    description: '본문 (Markdown)',
  })
  @IsString()
  @MinLength(1, { message: '내용을 입력해주세요' })
  content: string;

  @ApiPropertyOptional({
    enum: NoticeCategory,
    default: NoticeCategory.ANNOUNCEMENT,
  })
  @IsOptional()
  @IsEnum(NoticeCategory)
  category?: NoticeCategory;

  @ApiPropertyOptional({ default: false, description: '상단 고정 여부' })
  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;

  @ApiPropertyOptional({
    description: '게시 일시 (미지정 시 현재 시각)',
    example: '2026-05-10T09:00:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}
