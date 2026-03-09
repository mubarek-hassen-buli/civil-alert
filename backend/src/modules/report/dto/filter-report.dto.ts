import { IsString, IsOptional, IsIn, IsDateString } from 'class-validator';

export class FilterReportDto {
  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsIn(['roads', 'public_services', 'business'])
  @IsOptional()
  category?: string;

  @IsString()
  @IsIn(['info', 'warning', 'critical'])
  @IsOptional()
  urgency?: string;

  @IsString()
  @IsIn(['published', 'under_review', 'removed', 'verified'])
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsIn(['recent', 'urgent', 'confidence', 'validated'])
  @IsOptional()
  sort?: string;

  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}
