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

import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenusService } from './menus.service';

@ApiTags('menus')
@Controller()
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('restaurants/:restaurantId/menus')
  @ApiOperation({ summary: '식당 메뉴 목록 조회' })
  @ApiOkResponse({ description: '메뉴 목록 (대표 메뉴 우선)' })
  @ApiNotFoundResponse({ description: '식당을 찾을 수 없음' })
  findAll(@Param('restaurantId') restaurantId: string) {
    return this.menusService.findAllByRestaurant(restaurantId);
  }

  @Post('restaurants/:restaurantId/menus')
  @AdminOnly()
  @ApiOperation({ summary: '메뉴 등록 (Admin 전용)' })
  @ApiCreatedResponse({ description: '생성된 메뉴' })
  @ApiNotFoundResponse({ description: '식당을 찾을 수 없음' })
  create(
    @Param('restaurantId') restaurantId: string,
    @Body() dto: CreateMenuDto,
  ) {
    return this.menusService.create(restaurantId, dto);
  }

  @Patch('menus/:id')
  @AdminOnly()
  @ApiOperation({ summary: '메뉴 수정 (Admin 전용)' })
  @ApiOkResponse({ description: '수정된 메뉴' })
  @ApiNotFoundResponse({ description: '메뉴를 찾을 수 없음' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete('menus/:id')
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '메뉴 삭제 (Admin 전용)' })
  @ApiNoContentResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '메뉴를 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
