import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaProducerService.name);
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'pangchelin-api',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'kafka:9092')],
    });
    this.producer = this.kafka.producer();
  }

  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('Kafka Producer 연결 완료');
  }

  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  async send(topic: string, message: Record<string, unknown>) {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    this.logger.debug(`[${topic}] 메시지 발행: ${JSON.stringify(message)}`);
  }
}
