import { Module } from '@nestjs/common';

import { KafkaModule } from '../kafka/kafka.module';

import { ReportsConsumer } from './reports.consumer';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [KafkaModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsConsumer],
  exports: [ReportsService],
})
export class ReportsModule {}
