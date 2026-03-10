import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class ActionLogDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsOptional()
  target_user_id?: string;

  @IsString()
  @IsOptional()
  target_report_id?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}
