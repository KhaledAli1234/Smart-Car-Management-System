import { Types } from 'mongoose';

export const parseObjectId = (value: string): Types.ObjectId => {
  return Types.ObjectId.createFromHexString(value as string);
};
