import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { College, Zone } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class PartnershipInputDto {
  @ApiProperty({ enum: College, description: '제휴 단과대학' })
  @IsEnum(College)
  college: College;

  @ApiProperty({
    example: 'https://instagram.com/p/abcdef',
    description: '해당 단과대학용 Instagram 안내 게시글 URL',
  })
  @IsUrl({ require_protocol: true })
  @MaxLength(500)
  instagramUrl: string;
}

export class CreateRestaurantDto {
  @ApiProperty({ example: '할매분식', description: '식당 이름' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ enum: Zone, description: '구역' })
  @IsEnum(Zone)
  zone: Zone;

  @ApiProperty({ example: 37.6192, description: '위도' })
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: 127.0589, description: '경도' })
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: '서울 노원구 광운로 20', description: '주소' })
  @IsString()
  @MaxLength(200)
  address: string;

  @ApiPropertyOptional({ example: '02-123-4567', description: '전화번호' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiProperty({
    example: { mon: { open: '09:00', close: '22:00' }, sun: { closed: true } },
    description: '요일별 영업시간',
  })
  @IsObject()
  businessHours: Record<string, unknown>;

  @ApiPropertyOptional({ description: '제휴 식당 여부' })
  @IsOptional()
  @IsBoolean()
  isPartner?: boolean;

  @ApiPropertyOptional({
    type: [PartnershipInputDto],
    description: '제휴 단과대학 + Instagram URL 목록 (식당당 단과대학별 1개)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnershipInputDto)
  @ArrayUnique((p: PartnershipInputDto) => p.college, {
    message: '같은 단과대학을 중복으로 등록할 수 없어요',
  })
  partnerships?: PartnershipInputDto[];

  @ApiPropertyOptional({ type: [String], description: '연결할 카테고리 ID 목록' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];
}
