import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../../integrations/supabase/supabase.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * Returns the profile for a given user ID.
   */
  async getProfile(userId: string) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) {
      throw new NotFoundException('Profile not found');
    }

    return data;
  }

  /**
   * Updates a user's profile fields.
   */
  async updateProfile(
    userId: string,
    updates: { full_name?: string; username?: string; avatar_url?: string; city?: string; area?: string },
  ) {
    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select('*')
      .single();

    if (error) {
      this.logger.error('Failed to update profile', error.message);
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  /**
   * Recalculates and updates the trust score for a user.
   *
   * Factors:
   * - High ratio of real-voted reports → higher trust
   * - Low removal rate → higher trust
   * - Account age bonus
   */
  async recalculateTrustScore(userId: string) {
    const supabase = this.supabaseService.getClient();

    // Get user's reports
    const { data: reports } = await supabase
      .from('reports')
      .select('id, status, confidence_score')
      .eq('author_id', userId);

    if (!reports || reports.length === 0) {
      return; // No reports, keep default trust
    }

    const totalReports = reports.length;
    const removedReports = reports.filter((r) => r.status === 'removed').length;
    const verifiedReports = reports.filter((r) => r.status === 'verified').length;
    const avgConfidence =
      reports.reduce((sum, r) => sum + (r.confidence_score ?? 50), 0) / totalReports;

    // Calculate trust components
    const removalPenalty = (removedReports / totalReports) * 30; // Max -30 penalty
    const verifiedBonus = (verifiedReports / totalReports) * 20; // Max +20 bonus
    const confidenceBonus = ((avgConfidence - 50) / 50) * 20; // -20 to +20

    // Base trust of 50, clamped between 0-100
    let trustScore = 50 - removalPenalty + verifiedBonus + confidenceBonus;
    trustScore = Math.max(0, Math.min(100, Math.round(trustScore * 10) / 10));

    await supabase
      .from('profiles')
      .update({ trust_score: trustScore, updated_at: new Date().toISOString() })
      .eq('id', userId);

    return trustScore;
  }
}
