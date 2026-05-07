import { ApiPropertyOptional } from '@nestjs/swagger';
import { Zone } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

// 단일/배열 둘 다 받기 위해, 단일 값이 들어오면 배열로 감싼다.
const toArray = ({ value }: { value: unknown }): unknown =>
  value === undefined ? undefined : Array.isArray(value) ? value : [value];

export class QueryRestaurantDto {
  @ApiPropertyOptional({
    enum: Zone,
    isArray: true,
    description: '구역 필터 (다중 선택, ?zones=A&zones=B)',
  })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsEnum(Zone, { each: true })
  zones?: Zone[];

  @ApiPropertyOptional({
    isArray: true,
    type: String,
    description: '카테고리 ID (다중 선택, ?categoryIds=X&categoryIds=Y)',
  })
  @IsOptional()
  @Transform(toArray)
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

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
