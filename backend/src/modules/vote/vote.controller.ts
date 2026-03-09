import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CastVoteDto } from './dto/cast-vote.dto';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import { CurrentUser } from '../../common/decorators';
import { AuthUser } from '../../common/types';

@Controller('reports/:reportId/vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  /**
   * POST /api/v1/reports/:reportId/vote
   * Cast or toggle a Real/Fake vote.
   */
  @Post()
  @UseGuards(SupabaseAuthGuard)
  async castVote(
    @CurrentUser() user: AuthUser,
    @Param('reportId') reportId: string,
    @Body() dto: CastVoteDto,
  ) {
    return this.voteService.castVote(reportId, user.id, dto.vote_type);
  }

  /**
   * DELETE /api/v1/reports/:reportId/vote
   * Remove the user's vote.
   */
  @Delete()
  @UseGuards(SupabaseAuthGuard)
  async removeVote(
    @CurrentUser() user: AuthUser,
    @Param('reportId') reportId: string,
  ) {
    return this.voteService.removeVote(reportId, user.id);
  }

  /**
   * GET /api/v1/reports/:reportId/vote
   * Get vote counts for a report.
   */
  @Get()
  async getVoteCounts(@Param('reportId') reportId: string) {
    return this.voteService.getVoteCounts(reportId);
  }
}
