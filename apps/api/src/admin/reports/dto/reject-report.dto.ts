import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class RejectReportDto {
  @ApiProperty({ description: '반려 사유', example: '증빙 자료 부족' })
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  reason: string;
}
