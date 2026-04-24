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
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: '카테고리 전체 조회' })
  @ApiOkResponse({ description: '카테고리 목록' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '카테고리 단일 조회' })
  @ApiOkResponse({ description: '카테고리 상세' })
  @ApiNotFoundResponse({ description: '카테고리를 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: '카테고리 생성 (Admin 전용 — 추후 Guard 적용)' })
  @ApiCreatedResponse({ description: '생성된 카테고리' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: '카테고리 수정 (Admin 전용 — 추후 Guard 적용)' })
  @ApiOkResponse({ description: '수정된 카테고리' })
  @ApiNotFoundResponse({ description: '카테고리를 찾을 수 없음' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '카테고리 삭제 (Admin 전용 — 추후 Guard 적용)' })
  @ApiNoContentResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '카테고리를 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
