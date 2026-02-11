import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
} from 'class-validator';

export class CreateFuelDTO {
  @IsMongoId()
  user: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  cost: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsString()
  station?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  filledAt?: Date;
}

export class UpdateFuelDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  amount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsString()
  station?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsNumber()
  odometer?: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  filledAt?: Date;
}
