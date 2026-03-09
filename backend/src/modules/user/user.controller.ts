import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { AuthUser } from '../../common/types';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * GET /api/v1/users/me
   * Returns the authenticated user's profile.
   */
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  async getMyProfile(@CurrentUser() user: AuthUser) {
    return this.userService.getProfile(user.id);
  }

  /**
   * PATCH /api/v1/users/me
   * Updates the authenticated user's profile.
   */
  @Patch('me')
  @UseGuards(SupabaseAuthGuard)
  async updateMyProfile(
    @CurrentUser() user: AuthUser,
    @Body() body: { full_name?: string; username?: string; avatar_url?: string; city?: string; area?: string },
  ) {
    return this.userService.updateProfile(user.id, body);
  }
}
