import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportType } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    enum: ReportType,
    description: '제보 유형',
    example: 'RESTAURANT_INFO',
  })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiPropertyOptional({
    description: '대상 식당 ID (NEW_RESTAURANT 제외 필수)',
    example: 'clxxxxxx',
  })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiPropertyOptional({
    description: '대상 메뉴 ID (MENU_CHANGE 시 사용)',
    example: 'clxxxxxx',
  })
  @IsOptional()
  @IsString()
  menuId?: string;

  @ApiPropertyOptional({ description: '제보자 이름 (선택)', example: '홍길동' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  reporterName?: string;

  @ApiPropertyOptional({ description: '제보자 연락처 (선택)', example: '010-1234-5678' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  reporterContact?: string;

  @ApiProperty({ description: '제보 내용', example: '메뉴 가격이 바뀌었어요.' })
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  content: string;

  @ApiProperty({
    description: `type별 제안 데이터
- RESTAURANT_INFO: { phone?, address?, businessHours?, ... }
- MENU_CHANGE: { menuName, action: 'UPDATE'|'ADD'|'DELETE', oldPrice?, newPrice? }
- NEW_RESTAURANT: { name, address, latitude?, longitude?, menus?: [...] }
- CLOSED: { reason? }`,
    example: { action: 'UPDATE', menuName: '김치찌개', oldPrice: 7000, newPrice: 8000 },
  })
  @IsObject()
  suggestedData: Record<string, unknown>;

  @ApiPropertyOptional({ type: [String], description: '증빙 사진 URL 목록' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  imageUrls?: string[];
}
