import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IStreak } from 'src/common';

@Schema({ timestamps: true })
export class Streak implements IStreak {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  safeDrivingStreak: number;

  @Prop({ type: Number, default: 0 })
  maintenanceStreak: number;

  @Prop({ type: Number, default: 0 })
  badges: number;
}

export type StreakDocument = HydratedDocument<Streak>;
export const StreakModel = MongooseModule.forFeature([
  { name: Streak.name, schema: SchemaFactory.createForClass(Streak) },
]);
