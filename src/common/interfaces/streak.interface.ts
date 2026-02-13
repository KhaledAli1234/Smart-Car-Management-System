import { Types } from 'mongoose';

export interface IStreak {
  user: Types.ObjectId;
  safeDrivingDays: number;
  maintenanceDays: number;
  badge?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
