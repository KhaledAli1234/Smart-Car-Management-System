import { Types } from "mongoose";
import { MaintenanceTypeEnum } from "../enums";

export interface IMaintenance {
  user: Types.ObjectId;
  type: MaintenanceTypeEnum;
  cost: number;
  mileage?: number;
  performedAt: Date;
  nextMaintenanceAt?: Date;
}
