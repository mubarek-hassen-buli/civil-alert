import { Module } from '@nestjs/common';
import { ConfigModule } from './core/config/config.module';
import { SupabaseModule } from './integrations/supabase/supabase.module';
import { RedisModule } from './core/redis/redis.module';
import { AuthModule } from './core/auth/auth.module';
import { CloudinaryModule } from './integrations/cloudinary/cloudinary.module';
import { ReportModule } from './modules/report/report.module';
import { VoteModule } from './modules/vote/vote.module';
import { UserModule } from './modules/user/user.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ModerationModule } from './modules/moderation/moderation.module';

@Module({
  imports: [
    ConfigModule,
    SupabaseModule,
    RedisModule,
    AuthModule,
    CloudinaryModule,
    ReportModule,
    VoteModule,
    UserModule,
    SubscriptionModule,
    ModerationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}




