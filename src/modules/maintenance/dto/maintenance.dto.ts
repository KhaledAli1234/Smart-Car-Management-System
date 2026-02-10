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

  @IsDate()
  performedAt: Date;

  @IsOptional()
  @IsDate()
  nextMaintenanceAt?: Date;
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
