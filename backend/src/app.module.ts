import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { SupabaseModule } from './integrations/supabase/supabase.module';
import { RedisModule } from './core/redis/redis.module';
import { AuthModule } from './core/auth/auth.module';

@Module({
  imports: [ConfigModule, SupabaseModule, RedisModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
