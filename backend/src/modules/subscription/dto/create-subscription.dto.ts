import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsOptional()
  area?: string;

  @IsString()
  @IsOptional()
  category?: string;
}
