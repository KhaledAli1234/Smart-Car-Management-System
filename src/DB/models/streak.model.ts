import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IStreak } from 'src/common';


@Schema({ timestamps: true })
export class Streak implements IStreak {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  safeDrivingDays: number;

  @Prop({ type: Number, default: 0 })
  maintenanceDays: number;

  @Prop({ type: String })
  badge?: string;
}

export type StreakDocument = HydratedDocument<Streak>;

const streakSchema = SchemaFactory.createForClass(Streak);
export const StreakModel = MongooseModule.forFeature([
  { name: Streak.name, schema: streakSchema },
]);
