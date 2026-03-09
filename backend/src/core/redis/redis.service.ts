import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from '@upstash/redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const url = this.configService.getOrThrow<string>(
      'UPSTASH_REDIS_REST_URL',
    );
    const token = this.configService.getOrThrow<string>(
      'UPSTASH_REDIS_REST_TOKEN',
    );

    this.client = new Redis({ url, token });
    this.logger.log('Upstash Redis client initialized');
  }

  /** Get a cached value by key. */
  async get<T>(key: string): Promise<T | null> {
    return this.client.get<T>(key);
  }

  /** Set a value with optional TTL in seconds. */
  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, { ex: ttlSeconds });
    } else {
      await this.client.set(key, value);
    }
  }

  /** Delete a cached key. */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /** Check if a key exists. */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }
}
