import { ApiPropertyOptional } from '@nestjs/swagger';
import { Zone } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class QueryRestaurantDto {
  @ApiPropertyOptional({ enum: Zone, description: '구역 필터' })
  @IsOptional()
  @IsEnum(Zone)
  zone?: Zone;

  @ApiPropertyOptional({ description: '카테고리 ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: '메뉴 최대 가격 (원)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: '제휴 식당만 조회' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isPartner?: boolean;

  @ApiPropertyOptional({ description: '현재 영업중인 식당만 조회' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isOpen?: boolean;
}
