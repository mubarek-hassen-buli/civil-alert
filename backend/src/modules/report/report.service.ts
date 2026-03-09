import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../../integrations/supabase/supabase.service';
import { CloudinaryService } from '../../integrations/cloudinary/cloudinary.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Creates a new report with media files uploaded to Cloudinary.
   */
  async createReport(
    authorId: string,
    dto: CreateReportDto,
    files: Express.Multer.File[],
  ) {
    // Upload media to Cloudinary
    const { urls, thumbnailUrl } =
      await this.cloudinaryService.uploadMultipleFiles(files);

    const supabase = this.supabaseService.getClient();

    const { data, error } = await supabase
      .from('reports')
      .insert({
        author_id: authorId,
        title: dto.title,
        description: dto.description,
        category: dto.category,
        urgency: dto.urgency,
        city: dto.city,
        area: dto.area,
        place_name: dto.place_name || null,
        media_urls: urls,
        thumbnail_url: thumbnailUrl,
      })
      .select('*')
      .single();

    if (error) {
      this.logger.error('Failed to create report', error.message);
      throw new Error(`Failed to create report: ${error.message}`);
    }

    return data;
  }

  /**
   * Returns a paginated, filtered list of reports.
   */
  async getReports(filters: FilterReportDto) {
    const supabase = this.supabaseService.getClient();

    let query = supabase
      .from('reports')
      .select('*, profiles!reports_author_id_fkey(id, username, full_name, avatar_url)')
      .neq('status', 'removed');

    // Apply filters
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.area) {
      query = query.eq('area', filters.area);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.urgency) {
      query = query.eq('urgency', filters.urgency);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.from) {
      query = query.gte('created_at', filters.from);
    }
    if (filters.to) {
      query = query.lte('created_at', filters.to);
    }
    if (filters.search) {
      query = query.or(
        `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`,
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case 'urgent':
        query = query.order('urgency', { ascending: false });
        break;
      case 'confidence':
        query = query.order('confidence_score', { ascending: false });
        break;
      case 'validated':
        query = query.order('confidence_score', { ascending: false });
        break;
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false });
        break;
    }

    const { data, error } = await query.limit(50);

    if (error) {
      this.logger.error('Failed to fetch reports', error.message);
      throw new Error(`Failed to fetch reports: ${error.message}`);
    }

    return data;
  }

  /**
   * Returns a single report by ID with author profile and vote counts.
   */
  async getReportById(reportId: string) {
    const supabase = this.supabaseService.getClient();

    const { data: report, error } = await supabase
      .from('reports')
      .select('*, profiles!reports_author_id_fkey(id, username, full_name, avatar_url)')
      .eq('id', reportId)
      .single();

    if (error || !report) {
      throw new NotFoundException('Report not found');
    }

    // Fetch vote counts
    const { data: votes } = await supabase
      .from('votes')
      .select('vote_type')
      .eq('report_id', reportId);

    const realVotes = votes?.filter((v) => v.vote_type === 'real').length ?? 0;
    const fakeVotes = votes?.filter((v) => v.vote_type === 'fake').length ?? 0;

    return {
      ...report,
      realVotes,
      fakeVotes,
    };
  }

  /**
   * Updates the status of a report (admin only).
   */
  async updateReportStatus(
    reportId: string,
    status: string,
    adminId: string,
    reason: string,
  ) {
    const supabase = this.supabaseService.getClient();

    const { error: updateError } = await supabase
      .from('reports')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', reportId);

    if (updateError) {
      throw new Error(`Failed to update report status: ${updateError.message}`);
    }

    // Log the moderation action
    await supabase.from('moderation_logs').insert({
      report_id: reportId,
      admin_id: adminId,
      action: status === 'verified' ? 'verify' : status === 'removed' ? 'remove' : 'approve',
      reason,
    });

    return { success: true };
  }
}
