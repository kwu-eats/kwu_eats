import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: '한식', description: '카테고리 이름 (unique)' })
  @IsString()
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({ example: '🍚', description: '카테고리 아이콘 (이모지 또는 URL)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  icon?: string;
}
