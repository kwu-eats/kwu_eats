import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Admin, Consumer, Kafka } from 'kafkajs';

export type MessageHandler = (message: Record<string, unknown>) => Promise<void>;

@Injectable()
export class KafkaConsumerService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);
  private readonly kafka: Kafka;
  private readonly admin: Admin;
  private readonly consumers: Consumer[] = [];

  constructor(private readonly config: ConfigService) {
    this.kafka = new Kafka({
      clientId: 'pangchelin-api',
      brokers: [this.config.get<string>('KAFKA_BROKER', 'kafka:9092')],
      retry: { initialRetryTime: 300, retries: 10 },
    });
    this.admin = this.kafka.admin();
  }

  async subscribe(topic: string, groupId: string, handler: MessageHandler) {
    await this.ensureTopicExists(topic);
    await this.startConsumer(topic, groupId, handler);
  }

  private async ensureTopicExists(topic: string) {
    await this.admin.connect();
    try {
      const existing = await this.admin.listTopics();
      if (!existing.includes(topic)) {
        await this.admin.createTopics({
          topics: [{ topic, numPartitions: 1, replicationFactor: 1 }],
        });
        this.logger.log(`[${topic}] 토픽 생성 완료`);
      }
    } finally {
      await this.admin.disconnect();
    }
  }

  private async startConsumer(
    topic: string,
    groupId: string,
    handler: MessageHandler,
  ) {
    const consumer = this.kafka.consumer({ groupId });
    this.consumers.push(consumer);

    // 크래시 시 자동 재시작
    consumer.on(consumer.events.CRASH, ({ payload: { error } }) => {
      this.logger.warn(
        `[${topic}] Consumer 크래시 (${error.message}) → 5초 후 재시작`,
      );
      setTimeout(() => {
        void this.restartConsumer(consumer, topic, groupId, handler);
      }, 5000);
    });

    await this.connectAndRun(consumer, topic, groupId, handler);
    this.logger.log(`[${topic}] Consumer 구독 시작 (groupId: ${groupId})`);
  }

  private async connectAndRun(
    consumer: Consumer,
    topic: string,
    groupId: string,
    handler: MessageHandler,
  ) {
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ topic: t, partition, message }) => {
        const raw = message.value?.toString();
        if (!raw) return;
        try {
          const payload = JSON.parse(raw) as Record<string, unknown>;
          this.logger.debug(`[${t}] partition=${partition} 메시지 수신`);
          await handler(payload);
        } catch (err) {
          this.logger.error(`[${t}] 메시지 처리 실패: ${String(err)}`);
        }
      },
    });
  }

  private async restartConsumer(
    consumer: Consumer,
    topic: string,
    groupId: string,
    handler: MessageHandler,
  ) {
    try {
      await consumer.disconnect();
    } catch {
      // disconnect 실패해도 무시
    }
    try {
      await this.connectAndRun(consumer, topic, groupId, handler);
      this.logger.log(`[${topic}] Consumer 재연결 성공`);
    } catch (err) {
      this.logger.error(`[${topic}] Consumer 재연결 실패: ${String(err)}`);
      setTimeout(() => {
        void this.restartConsumer(consumer, topic, groupId, handler);
      }, 5000);
    }
  }

  async onModuleDestroy() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
