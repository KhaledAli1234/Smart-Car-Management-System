import { Type } from 'class-transformer';
import { IsMongoId, IsNumber, IsOptional } from 'class-validator';

export class CreateStreakDTO {
  @IsMongoId()
  user: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  safeDrivingStreak?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maintenanceStreak?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  badges?: number;
}

export class UpdateStreakDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  safeDrivingStreak?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maintenanceStreak?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  badges?: number;
}
