import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../../integrations/supabase/supabase.service';

@Injectable()
export class VoteService {
  private readonly logger = new Logger(VoteService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Casts a Real or Fake vote on a report.
   * If the user already voted, updates the existing vote.
   */
  async castVote(reportId: string, userId: string, voteType: string) {
    const supabase = this.supabaseService.getClient();

    // Check if user already voted on this report
    const { data: existingVote } = await supabase
      .from('votes')
      .select('id, vote_type')
      .eq('report_id', reportId)
      .eq('user_id', userId)
      .single();

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Same vote — remove it (toggle off)
        await supabase.from('votes').delete().eq('id', existingVote.id);
      } else {
        // Different vote — update it
        await supabase
          .from('votes')
          .update({ vote_type: voteType })
          .eq('id', existingVote.id);
      }
    } else {
      // New vote
      const { error } = await supabase.from('votes').insert({
        report_id: reportId,
        user_id: userId,
        vote_type: voteType,
      });

      if (error) {
        this.logger.error('Failed to cast vote', error.message);
        throw new ConflictException('Failed to cast vote');
      }
    }

    // Recalculate confidence score
    await this.recalculateConfidence(reportId);

    // Return updated vote counts
    return this.getVoteCounts(reportId, userId);
  }

  /**
   * Removes a user's vote from a report.
   */
  async removeVote(reportId: string, userId: string) {
    const supabase = this.supabaseService.getClient();

    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('report_id', reportId)
      .eq('user_id', userId);

    if (error) {
      throw new NotFoundException('Vote not found');
    }

    await this.recalculateConfidence(reportId);
    return this.getVoteCounts(reportId, userId);
  }

  /**
   * Returns vote counts and the current user's vote for a report.
   */
  async getVoteCounts(reportId: string, userId?: string) {
    const supabase = this.supabaseService.getClient();

    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type, user_id')
      .eq('report_id', reportId);

    const realVotes = votes?.filter((v) => v.vote_type === 'real').length ?? 0;
    const fakeVotes = votes?.filter((v) => v.vote_type === 'fake').length ?? 0;

    // Check if current user has voted
    const userVote = userId
      ? votes?.find((v) => v.user_id === userId)?.vote_type ?? null
      : null;

    return { realVotes, fakeVotes, userVote };
  }

  /**
   * Recalculates the confidence score for a report based on votes.
   * Formula: (realVotes / totalVotes) * 100, with a minimum base of 50.
   */
  private async recalculateConfidence(reportId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('report_id', reportId);

    const realCount = votes?.filter((v) => v.vote_type === 'real').length ?? 0;
    const fakeCount = votes?.filter((v) => v.vote_type === 'fake').length ?? 0;
    const total = realCount + fakeCount;

    // If no votes, default to 50
    let confidenceScore = 50.0;

    if (total > 0) {
      // Weighted formula: ratio-based with dampening for low vote counts
      const ratio = realCount / total;
      const dampening = Math.min(total / 10, 1); // Full weight at 10+ votes
      confidenceScore = 50 + (ratio - 0.5) * 100 * dampening;
      confidenceScore = Math.max(0, Math.min(100, confidenceScore));
    }

    await supabase
      .from('reports')
      .update({
        confidence_score: Math.round(confidenceScore * 10) / 10,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reportId);
  }
}
