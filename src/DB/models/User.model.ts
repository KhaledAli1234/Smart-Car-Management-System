import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import {
  GenderEnum,
  LanguageEnum,
  providerEnum,
  RoleEnum,
} from 'src/common/enums';
import { OtpDocument } from './Otp.model';
import { generatHash, IUser } from 'src/common';

@Schema({
  timestamps: true,
  strictQuery: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 2,
    maxlength: 25,
    trim: true,
  })
  lastName: string;

  @Virtual({
    get: function (this: User) {
      return this.firstName + ' ' + this.lastName;
    },
    set: function (vaule: string) {
      const [firstName, lastName] = vaule.split(' ') || [];
      this.set({ firstName, lastName });
    },
  })
  username: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: Date,
  })
  confirmedAt: Date;

  @Prop({
    type: String,
    required: function (this: User) {
      return this.provider === providerEnum.GOOGLE ? false : true;
    },
  })
  password: string;

  @Prop({
    type: String,
  })
  profileImage: string;

  @Prop({
    type: String,
  })
  profilePicture: string;

  @Prop({
    type: String,
    enum: providerEnum,
    default: providerEnum.SYSTEM,
  })
  provider: providerEnum;

  @Prop({
    type: String,
    enum: GenderEnum,
    default: GenderEnum.male,
  })
  gender: GenderEnum;

  @Prop({
    type: String,
    enum: RoleEnum,
    default: RoleEnum.user,
  })
  role: RoleEnum;

  @Prop({
    type: String,
    enum: LanguageEnum,
    default: LanguageEnum.EN,
  })
  preferredLanguage: LanguageEnum;

  @Prop({
    type: Date,
  })
  changeCredentialsTime: Date;

  @Virtual()
  otp: OtpDocument[];

}

export const userSchema = SchemaFactory.createForClass(User);
userSchema.virtual('otp', {
  localField: '_id',
  foreignField: 'createdBy',
  ref: 'Otp',
});
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await generatHash(this.password);
  }
});
export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);