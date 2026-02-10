import { IsMongoId, IsNumber, IsOptional, IsString } from 'class-validator';

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
  date?: Date; 
}

export class UpdateFuelDTO {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  distance?: number;

  @IsOptional()
  @IsString()
  station?: string;

  @IsOptional()
  date?: Date;
}
