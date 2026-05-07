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

import { AdminOnly } from '../auth/decorators/admin-only.decorator';
import {
  AdminPayload,
  CurrentAdmin,
} from '../auth/decorators/current-admin.decorator';

import { CreateNoticeDto } from './dto/create-notice.dto';
import { QueryNoticeDto } from './dto/query-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticesService } from './notices.service';

@ApiTags('notices')
@Controller('notices')
export class NoticesController {
  constructor(private readonly noticesService: NoticesService) {}

  @Get()
  @ApiOperation({ summary: '공지 목록 (고정글 우선, 최신순)' })
  @ApiOkResponse({ description: '공지 목록 + pagination' })
  findAll(@Query() query: QueryNoticeDto) {
    return this.noticesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '공지 상세 (Markdown 본문 포함)' })
  @ApiOkResponse({ description: '공지 상세' })
  @ApiNotFoundResponse({ description: '공지를 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.noticesService.findOne(id);
  }

  @Post()
  @AdminOnly()
  @ApiOperation({ summary: '공지 작성 (Admin 전용)' })
  @ApiCreatedResponse({ description: '생성된 공지' })
  create(
    @Body() dto: CreateNoticeDto,
    @CurrentAdmin() admin: AdminPayload,
  ) {
    return this.noticesService.create(admin.id, dto);
  }

  @Patch(':id')
  @AdminOnly()
  @ApiOperation({ summary: '공지 수정 (Admin 전용)' })
  @ApiOkResponse({ description: '수정된 공지' })
  @ApiNotFoundResponse({ description: '공지를 찾을 수 없음' })
  update(@Param('id') id: string, @Body() dto: UpdateNoticeDto) {
    return this.noticesService.update(id, dto);
  }

  @Delete(':id')
  @AdminOnly()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '공지 삭제 (Admin 전용)' })
  @ApiNoContentResponse({ description: '삭제 성공' })
  @ApiNotFoundResponse({ description: '공지를 찾을 수 없음' })
  remove(@Param('id') id: string) {
    return this.noticesService.remove(id);
  }
}
