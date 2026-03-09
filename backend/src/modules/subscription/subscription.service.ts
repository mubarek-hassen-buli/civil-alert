import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../../integrations/supabase/supabase.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Adds a new subscription alert for a user.
   */
  async subscribe(userId: string, dto: CreateSubscriptionDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        city: dto.city,
        area: dto.area || null,
        category: dto.category || null,
      })
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException('You are already subscribed to this exact alert.');
      }
      this.logger.error('Failed to create subscription', error.message);
      throw new Error(`Failed to create subscription: ${error.message}`);
    }

    return data;
  }

  /**
   * Removes an existing subscription.
   */
  async unsubscribe(userId: string, subscriptionId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('subscriptions')
      .delete()
      .eq('id', subscriptionId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Failed to delete subscription: ${error.message}`);
    }

    return { success: true };
  }

  /**
   * Returns all subscriptions for a given user.
   */
  async getUserSubscriptions(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch subscriptions: ${error.message}`);
    }

    return data;
  }
}
