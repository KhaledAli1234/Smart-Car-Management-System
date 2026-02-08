import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { emailEvent, generatHash, IOtp, OtpEnum } from 'src/common';

@Schema({
  timestamps: true,
})
export class Otp implements IOtp {
  @Prop({ type: String, required: true })
  otp: string;

  @Prop({ type: Date, required: true })
  expiredAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: String,
    enum: OtpEnum,
    required: true,
  })
  type: OtpEnum;
}

const otpSchema = SchemaFactory.createForClass(Otp);
otpSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.pre(
  'save',
  async function (this: OtpDocument & { wasNew: boolean; plainOtp?: string }) {
    this.wasNew = this.isNew;
    if (this.isModified('otp')) {
      this.plainOtp = this.otp;
      this.otp = await generatHash(this.otp);
      await this.populate([{ path: 'createdBy', select: 'email' }]);
    }
  },
);

otpSchema.post('save', async function (doc) {
  const that = this as unknown as OtpDocument & {
    wasNew: boolean;
    plainOtp?: string;
  };
  if (that.wasNew && that.plainOtp) {
    emailEvent.emit(doc.type, {
      to: (that.createdBy as any).email,
      otp: that.plainOtp,
    });
  }
});
export type OtpDocument = HydratedDocument<Otp>;
export const OtpModel = MongooseModule.forFeature([
  { name: Otp.name, schema: otpSchema },
]);
