import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ModerationService } from './moderation.service';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import { RolesGuard } from '../../core/auth/roles.guard';
import { Roles, CurrentUser } from '../../common/decorators';
import { AuthUser } from '../../common/types';

@Controller('admin/moderation')
@UseGuards(SupabaseAuthGuard, RolesGuard)
@Roles('admin', 'super_admin') // Only admins and super_admins can access these
export class ModerationController {
  constructor(private readonly moderationService: ModerationService) {}

  /**
   * GET /api/v1/admin/moderation/logs
   * Retrieves audit logs for admin actions.
   */
  @Get('logs')
  async getLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.moderationService.getLogs(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 50,
    );
  }

  /**
   * PATCH /api/v1/admin/moderation/users/:id/ban
   * Toggles the ban status of a user.
   */
  @Patch('users/:id/ban')
  async toggleBanStatus(
    @CurrentUser() admin: AuthUser,
    @Param('id') targetUserId: string,
    @Body() body: { is_banned: boolean; reason?: string },
  ) {
    return this.moderationService.setUserBanStatus(
      admin.id,
      targetUserId,
      body.is_banned,
      body.reason,
    );
  }
}
