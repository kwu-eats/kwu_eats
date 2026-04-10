import { IsString, IsNumber, IsOptional, IsArray, IsBoolean, IsString as IsStr, Min, Max } from 'class-validator';

export class CreateMenuDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  @Max(100000)
  price: number;

  @IsOptional()
  @IsBoolean()
  isRepresentative?: boolean;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsArray()
  menus?: CreateMenuDto[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
