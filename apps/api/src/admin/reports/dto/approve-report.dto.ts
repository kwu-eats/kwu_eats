import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional } from 'class-validator';

export class ApproveReportDto {
  @ApiPropertyOptional({
    description: 'true면 제안 데이터를 실제 DB에 즉시 반영 (APPLIED)',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  applyNow?: boolean;

  @ApiPropertyOptional({
    description: '편집된 데이터 (제공 시 suggestedData 대신 이 데이터를 반영)',
  })
  @IsOptional()
  @IsObject()
  editedData?: Record<string, unknown>;
}
