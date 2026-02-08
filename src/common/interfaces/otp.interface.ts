import { OtpEnum } from '../enums';
import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface IOtp {
  _id?: Types.ObjectId;

  otp: string;
  expiredAt: Date;
  createdBy: Types.ObjectId | IUser;
  type: OtpEnum;

  createdAt?: Date;
  updatedAt?: Date;
}
