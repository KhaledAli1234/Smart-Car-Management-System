import { IsBoolean, IsEnum, IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';
import { SpeedLevelEnum } from 'src/common';

export class CreateTripDTO {
  @IsMongoId()
  driver: string;

  @IsString()
  route: string;

  @IsNumber()
  distance: number;

  @IsOptional()
  startTime?: Date;

  @IsOptional()
  endTime?: Date;

  @IsOptional()
  @IsEnum(SpeedLevelEnum)
  speedLevel?: SpeedLevelEnum;
}

export class UpdateTripDTO {
  @IsOptional()
  @IsString()
  route?: string;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  startTime?: Date;

  @IsOptional()
  endTime?: Date;

  @IsOptional()
  @IsEnum(SpeedLevelEnum)
  speedLevel?: SpeedLevelEnum;

  @IsOptional()
  @IsBoolean()
  confirmed?: boolean;
}
