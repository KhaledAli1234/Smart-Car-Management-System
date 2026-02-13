import { Types } from 'mongoose';
import { SpeedLevelEnum } from '../enums/trip.enum';

export interface ITrip {
  user: Types.ObjectId;       
  route: string;                
  distance: number;            
  startTime?: Date;           
  endTime?: Date;             
  speedLevel?: SpeedLevelEnum; 
  confirmed?: boolean;          
}
