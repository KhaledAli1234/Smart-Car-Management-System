import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IMaintenance, MaintenanceTypeEnum } from 'src/common';


@Schema({ timestamps: true })
export class Maintenance implements IMaintenance {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ enum: MaintenanceTypeEnum, required: true })
  type: MaintenanceTypeEnum;

  @Prop({ type: Number, required: true })
  cost: number;

  @Prop(Number)
  mileage?: number;

  @Prop({ type: Date, required: true })
  performedAt: Date;

  @Prop(Date)
  nextMaintenanceAt?: Date;
}

export type MaintenanceDocument = HydratedDocument<Maintenance>;
const maintenanceSchema = SchemaFactory.createForClass(Maintenance);
export const MaintenanceModel = MongooseModule.forFeature([
  { name: Maintenance.name, schema: maintenanceSchema },
]);
