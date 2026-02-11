import { Type } from 'class-transformer';
import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsDate,
} from 'class-validator';
import { MaintenanceTypeEnum } from 'src/common';

export class CreateMaintenanceDTO {
  @IsMongoId()
  user: string;

  @IsEnum(MaintenanceTypeEnum)
  type: MaintenanceTypeEnum;

  @IsNumber()
  cost: number;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @Type(() => Date)
  @IsDate()
  performedAt: Date;

  @Type(() => Date)
  @IsDate()
  nextMaintenanceAt: Date;
}

export class UpdateMaintenanceDTO {
  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  mileage?: number;

  @IsOptional()
  @IsDate()
  nextMaintenanceAt?: Date;
}
