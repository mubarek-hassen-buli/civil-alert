import { IsString, IsNotEmpty, IsIn, IsOptional } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsIn(['roads', 'public_services', 'business'])
  category: string;

  @IsString()
  @IsIn(['info', 'warning', 'critical'])
  urgency: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  area: string;

  @IsString()
  @IsOptional()
  place_name?: string;
}
