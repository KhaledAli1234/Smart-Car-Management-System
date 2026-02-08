import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ITrip } from 'src/common';
import { SpeedLevelEnum } from 'src/common/enums/trip.enum';

@Schema({
  timestamps: true,
})
export class Trip implements ITrip {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driver: Types.ObjectId;

  @Prop({ type: String, required: true })
  route: string;

  @Prop({ type: Number, required: true })
  distance: number;

  @Prop({ type: Date })
  startTime: Date;

  @Prop({ type: Date })
  endTime: Date;

  @Prop({
    type: String,
    enum: SpeedLevelEnum,
    default: SpeedLevelEnum.normal,
  })
  speedLevel: SpeedLevelEnum;

  @Prop({ type: Boolean, default: false })
  confirmed: boolean;
}

const tripSchema = SchemaFactory.createForClass(Trip);
export type TripDocument = HydratedDocument<Trip>;
export const TripModel = MongooseModule.forFeature([
  { name: Trip.name, schema: tripSchema },
]);
