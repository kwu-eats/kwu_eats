import { ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus, ReportType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export class QueryAdminReportsDto {
  @ApiPropertyOptional({ enum: ReportStatus, description: '제보 상태 필터' })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({ enum: ReportType, description: '제보 유형 필터' })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({ default: 1, description: '페이지 번호' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, description: '페이지 크기 (최대 100)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
