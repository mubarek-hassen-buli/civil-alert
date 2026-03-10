import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../integrations/supabase/supabase.service';
import { ActionLogDto } from './dto/action-log.dto';

@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Logs a moderation action (e.g., banning a user, rejecting a report).
   */
  async logAction(adminId: string, dto: ActionLogDto) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('moderation_logs')
      .insert({
        admin_id: adminId,
        action: dto.action,
        target_user_id: dto.target_user_id || null,
        target_report_id: dto.target_report_id || null,
        reason: dto.reason || null,
      })
      .select('*')
      .single();

    if (error) {
      this.logger.error('Failed to create moderation log', error.message);
      throw new Error(`Failed to create moderation log: ${error.message}`);
    }

    return data;
  }

  /**
   * Retrieves paginated moderation logs.
   */
  async getLogs(page = 1, limit = 50) {
    const supabase = this.supabaseService.getClient();
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('moderation_logs')
      .select(`
        *,
        admin:profiles!admin_id(full_name, username),
        target_user:profiles!target_user_id(full_name, username)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch logs: ${error.message}`);
    }

    return {
      data,
      total: count || 0,
    };
  }

  /**
   * Bans or unbans a user.
   */
  async setUserBanStatus(adminId: string, userId: string, isBanned: boolean, reason?: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('profiles')
      .update({
        is_banned: isBanned,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update user ban status: ${error.message}`);
    }

    // Log the action
    await this.logAction(adminId, {
      action: isBanned ? 'ban_user' : 'unban_user',
      target_user_id: userId,
      reason,
    });

    return { success: true, is_banned: isBanned };
  }
}
