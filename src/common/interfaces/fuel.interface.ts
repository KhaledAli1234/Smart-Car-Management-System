import { Types } from 'mongoose';

export interface IFuel {
  user: Types.ObjectId;
  amount: number;        
  cost: number;          
  distance?: number;     
  station?: string;      
  date?: Date;           
  createdAt?: Date;
  updatedAt?: Date;
}
