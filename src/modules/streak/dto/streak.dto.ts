import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStreakDTO {
  @IsMongoId()
  user: string;

  @IsNumber()
  safeDrivingDays: number;

  @IsNumber()
  maintenanceDays: number;

  @IsOptional()
  @IsString()
  badge?: string;
}

export class UpdateStreakDTO {
  @IsOptional()
  @IsNumber()
  safeDrivingDays?: number;

  @IsOptional()
  @IsNumber()
  maintenanceDays?: number;

  @IsOptional()
  @IsString()
  badge?: string;
}
