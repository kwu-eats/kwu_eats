import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: '김치찌개', description: '메뉴 이름' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 8000, description: '가격 (원)' })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'https://...', description: '메뉴 이미지 URL' })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({ example: false, description: '대표 메뉴 여부' })
  @IsOptional()
  @IsBoolean()
  isSignature?: boolean;
}
