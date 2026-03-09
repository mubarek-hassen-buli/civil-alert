import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { FilterReportDto } from './dto/filter-report.dto';
import { SupabaseAuthGuard } from '../../core/auth/supabase-auth.guard';
import { RolesGuard } from '../../common/guards';
import { CurrentUser, Roles } from '../../common/decorators';
import { AuthUser } from '../../common/types';

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  /**
   * POST /api/v1/reports
   * Creates a new report with uploaded media files.
   */
  @Post()
  @UseGuards(SupabaseAuthGuard)
  @UseInterceptors(FilesInterceptor('media', 5))
  async createReport(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateReportDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one media file is required');
    }

    return this.reportService.createReport(user.id, dto, files);
  }

  /**
   * GET /api/v1/reports
   * Returns a filtered list of reports.
   */
  @Get()
  async getReports(@Query() filters: FilterReportDto) {
    return this.reportService.getReports(filters);
  }

  /**
   * GET /api/v1/reports/:id
   * Returns a single report with vote counts.
   */
  @Get(':id')
  async getReportById(@Param('id') id: string) {
    return this.reportService.getReportById(id);
  }

  /**
   * PATCH /api/v1/reports/:id/status
   * Updates report status (admin only).
   */
  @Patch(':id/status')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async updateReportStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('reason') reason: string,
  ) {
    return this.reportService.updateReportStatus(id, status, user.id, reason);
  }
}
