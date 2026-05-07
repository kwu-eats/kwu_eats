import { ApiPropertyOptional } from '@nestjs/swagger';
import { NoticeCategory } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryNoticeDto {
  @ApiPropertyOptional({ enum: NoticeCategory })
  @IsOptional()
  @IsEnum(NoticeCategory)
  category?: NoticeCategory;

  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
