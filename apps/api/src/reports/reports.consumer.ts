import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ReportType } from '@prisma/client';

import { KafkaConsumerService } from '../kafka/kafka.consumer.service';

import { CreateReportDto } from './dto/create-report.dto';
import { REPORT_SUBMITTED_TOPIC, ReportsService } from './reports.service';

@Injectable()
export class ReportsConsumer implements OnModuleInit {
  private readonly logger = new Logger(ReportsConsumer.name);

  constructor(
    private readonly kafkaConsumer: KafkaConsumerService,
    private readonly reportsService: ReportsService,
  ) {}

  async onModuleInit() {
    await this.kafkaConsumer.subscribe(
      REPORT_SUBMITTED_TOPIC,
      'reports-consumer-group',
      async (payload) => {
        const dto = payload as unknown as CreateReportDto & { receivedAt: string };
        const report = await this.reportsService.saveToDb({
          type: dto.type as ReportType,
          restaurantId: dto.restaurantId,
          menuId: dto.menuId,
          reporterName: dto.reporterName,
          reporterContact: dto.reporterContact,
          content: dto.content,
          suggestedData: dto.suggestedData,
          imageUrls: dto.imageUrls,
        });
        this.logger.log(
          `제보 DB 저장 완료 → id: ${report.id} (접수: ${dto.receivedAt})`,
        );
      },
    );
  }
}
