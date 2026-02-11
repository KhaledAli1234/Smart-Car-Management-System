import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IFuel } from 'src/common';

@Schema({ timestamps: true })
export class Fuel implements IFuel {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Number, required: true })
  cost: number;

  @Prop({ type: Number, required: true })
  distance: number;

  @Prop({ type: String })
  station?: string;

  @Prop({ type: Date, default: Date.now })
  date?: Date;

  @Prop({ type: Number })
  odometer?: number;

  @Prop({ type: Date })
  filledAt?: Date;
}

export type FuelDocument = HydratedDocument<Fuel>;
const fuelSchema = SchemaFactory.createForClass(Fuel);
export const FuelModel = MongooseModule.forFeature([
  { name: Fuel.name, schema: fuelSchema },
]);
