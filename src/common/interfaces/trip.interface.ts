import { Types } from 'mongoose';
import { SpeedLevelEnum } from '../enums/trip.enum';

export interface ITrip {
  driver: Types.ObjectId;       
  route: string;                
  distance: number;            
  startTime?: Date;           
  endTime?: Date;             
  speedLevel?: SpeedLevelEnum; 
  confirmed?: boolean;          
}
