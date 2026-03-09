import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { AuthUser } from '../../common/types';

@Controller('subscriptions')
@UseGuards(SupabaseAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  /**
   * POST /api/v1/subscriptions
   * Create a new subscription alert.
   */
  @Post()
  async subscribe(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSubscriptionDto,
  ) {
    return this.subscriptionService.subscribe(user.id, dto);
  }

  /**
   * GET /api/v1/subscriptions
   * Get all active subscriptions for the current user.
   */
  @Get()
  async getMySubscriptions(@CurrentUser() user: AuthUser) {
    return this.subscriptionService.getUserSubscriptions(user.id);
  }

  /**
   * DELETE /api/v1/subscriptions/:id
   * Remove a subscription.
   */
  @Delete(':id')
  async unsubscribe(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.subscriptionService.unsubscribe(user.id, id);
  }
}
