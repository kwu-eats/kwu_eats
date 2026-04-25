import { Body, Controller, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

import { CreateReportDto } from './dto/create-report.dto';
import { ReportsService } from './reports.service';

@ApiTags('reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @ApiOperation({ summary: '제보 접수 (IP 기준 분당 5회 제한)' })
  @ApiCreatedResponse({ description: '접수된 제보 ID + 상태' })
  create(@Body() dto: CreateReportDto) {
    return this.reportsService.create(dto);
  }
}
