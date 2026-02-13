import { IsMongoId } from 'class-validator';

export class DashboardQueryDTO {
  @IsMongoId()
  userId: string;
}
