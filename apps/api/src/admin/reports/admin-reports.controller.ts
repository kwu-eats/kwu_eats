import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AdminOnly } from '../../auth/decorators/admin-only.decorator';
import {
  AdminPayload,
  CurrentAdmin,
} from '../../auth/decorators/current-admin.decorator';
import { AdminReportsService } from './admin-reports.service';
import { ApproveReportDto } from './dto/approve-report.dto';
import { QueryAdminReportsDto } from './dto/query-admin-reports.dto';
import { RejectReportDto } from './dto/reject-report.dto';

@ApiTags('admin/reports')
@AdminOnly()
@Controller('admin/reports')
export class AdminReportsController {
  constructor(private readonly adminReportsService: AdminReportsService) {}

  @Get()
  @ApiOperation({ summary: '제보 목록 조회 (페이지네이션, 최신순)' })
  @ApiOkResponse({ description: '제보 목록 + pagination' })
  findAll(@Query() query: QueryAdminReportsDto) {
    return this.adminReportsService.findAll(query);
  }

  @Get('stats')
  @ApiOperation({ summary: '제보 통계' })
  @ApiOkResponse({ description: '전체/상태별 건수 + 이번 주·달 통계' })
  stats() {
    return this.adminReportsService.stats();
  }

  @Get(':id')
  @ApiOperation({ summary: '제보 상세 조회 (currentData 포함)' })
  @ApiOkResponse({ description: '제보 상세 + 현재 DB 데이터' })
  @ApiNotFoundResponse({ description: '제보를 찾을 수 없음' })
  findOne(@Param('id') id: string) {
    return this.adminReportsService.findOne(id);
  }

  @Post(':id/approve')
  @ApiOperation({ summary: '제보 승인 (applyNow=true면 즉시 반영)' })
  @ApiOkResponse({ description: 'APPROVED 또는 APPLIED 상태로 전환된 제보' })
  @ApiBadRequestResponse({ description: '이미 처리된 제보 또는 반영 실패' })
  @ApiNotFoundResponse({ description: '제보를 찾을 수 없음' })
  approve(
    @Param('id') id: string,
    @Body() dto: ApproveReportDto,
    @CurrentAdmin() admin: AdminPayload,
  ) {
    return this.adminReportsService.approve(id, admin.id, dto);
  }

  @Post(':id/reject')
  @ApiOperation({ summary: '제보 반려 (사유 필수)' })
  @ApiOkResponse({ description: 'REJECTED 상태로 전환된 제보' })
  @ApiBadRequestResponse({ description: '이미 처리된 제보' })
  @ApiNotFoundResponse({ description: '제보를 찾을 수 없음' })
  reject(
    @Param('id') id: string,
    @Body() dto: RejectReportDto,
    @CurrentAdmin() admin: AdminPayload,
  ) {
    return this.adminReportsService.reject(id, admin.id, dto);
  }
}
