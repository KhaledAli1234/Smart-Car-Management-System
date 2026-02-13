import { Types } from 'mongoose';

export interface IStreak {
  _id?: Types.ObjectId; 
  user: Types.ObjectId;
  safeDrivingStreak: number; 
  maintenanceStreak: number;
  badges: number; 
  createdAt?: Date;
  updatedAt?: Date;
}
