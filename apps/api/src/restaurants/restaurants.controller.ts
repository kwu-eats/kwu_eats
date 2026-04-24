import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { QueryRestaurantDto } from './dto/query-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: '식당 목록 조회 (필터링)' })
  @ApiOkResponse({ description: '식당 목록 + 카테고리 + 대표 메뉴' })
  findAll(@Query() query: QueryRestaurantDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '식당 상세 조회' })
  @ApiOkResponse({ description: '식당 상세 + 전체 메뉴 + 카테고리' })
  @ApiNotFoundResponse({ description: '식당을 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '식당 등록 (Admin 전용 — 추후 Guard 적용)' })
  @ApiCreatedResponse({ description: '생성된 식당' })
  create(@Body() dto: CreateRestaurantDto) {
    return this.restaurantsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '식당 수정 (Admin 전용 — 추후 Guard 적용)' })
  @ApiOkResponse({ description: '수정된 식당' })
  @ApiNotFoundResponse({ description: '식당을 찾을 수 없음' })
  update(@Param('id') id: string, @Body() dto: UpdateRestaurantDto) {
    return this.restaurantsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '식당 삭제 (Admin 전용 — 추후 Guard 적용)' })
  @ApiNoContentResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '식당을 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(id);
  }
}
