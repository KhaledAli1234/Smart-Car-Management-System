import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  createNumericalOtp,
  emailEvent,
  LoginCredentialsResponse,
  OtpEnum,
  providerEnum,
  SecuirtyService,
  TokenService,
} from 'src/common';
import { OtpRepository, UserDocument, UserRepository } from 'src/DB';
import {
  ConfirmEmailDTO,
  GmailDTO,
  LoginBodyDTO,
  ResendConfirmEmailDTO,
  ResetForgotPasswordDTO,
  SendForgotPasswordDTO,
  SignupBodyDTO,
  VerifyForgotPasswordDTO,
} from './dto/auth.dto';
import { Types } from 'mongoose';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpRepository: OtpRepository,
    private readonly secuirtyService: SecuirtyService,
    private readonly tokenService: TokenService,
  ) {}
  
  private async createConfirmEmailOtp(
    userId: Types.ObjectId,
    userEmail: string,
  ) {
    const otp = createNumericalOtp();

    await this.otpRepository.create({
      data: [
        {
          otp,
          expiredAt: new Date(Date.now() + 2 * 60 * 1000),
          createdBy: userId,
          type: OtpEnum.ConfirmEmail,
        },
      ],
    });
  }
  private async createResetPasswordOtp(userId: Types.ObjectId) {
    await this.otpRepository.create({
      data: [
        {
          otp: createNumericalOtp(),
          type: OtpEnum.ResetPassword,
          expiredAt: new Date(Date.now() + 5 * 60 * 1000),
          createdBy: userId,
        },
      ],
    });
  }
  private async verifyGoogleAccount(idToken: string): Promise<TokenPayload> {
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.WEB_CLIENT_ID?.split(',') || [],
    });
    const payload = ticket.getPayload();
    if (!payload?.email_verified) {
      throw new BadRequestException('fail to verify this google account');
    }
    return payload;
  }

  async signup(data: SignupBodyDTO): Promise<string> {
    const { email, username, password } = data;

    const checkUserExist = await this.userRepository.findOne({
      filter: { email },
    });
    if (checkUserExist) {
      throw new ConflictException('Email Exist');
    }

    const [user] = await this.userRepository.create({
      data: [{ username, email, password }],
    });
    if (!user) throw new BadRequestException('fail to signup');

    await this.createConfirmEmailOtp(user._id, user.email);

    return 'Done';
  }
  async resendConfirmEmail(data: ResendConfirmEmailDTO): Promise<string> {
    const { email } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching account');
    }
    if (user.otp?.length) {
      throw new ConflictException(
        `sorry we cannot grant you new OTP , please try again after:${user.otp[0].expiredAt}`,
      );
    }

    await this.createConfirmEmailOtp(user._id, user.email);;

    return 'Done';
  }
  async confirmEmail(data: ConfirmEmailDTO): Promise<string> {
    const { email, otp } = data;
    const user = await this.userRepository.findOne({
      filter: { email, confirmedAt: { $exists: false } },
      options: {
        populate: [{ path: 'otp', match: { type: OtpEnum.ConfirmEmail } }],
      },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching account');
    }
    if (
      !(
        user.otp?.length &&
        (await this.secuirtyService.compareHash(otp, user.otp[0].otp))
      )
    ) {
      throw new BadRequestException('invalid otp');
    }

    user.confirmedAt = new Date();
    await user.save();
    await this.otpRepository.deleteOne({ filter: { _id: user.otp[0]._id } });

    return 'Done';
  }
  async login(data: LoginBodyDTO): Promise<LoginCredentialsResponse> {
    const { email, password } = data;
    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: providerEnum.SYSTEM,
      },
    });
    if (!user) {
      throw new NotFoundException('fail to find matching account');
    }
    if (!(await this.secuirtyService.compareHash(password, user.password))) {
      throw new NotFoundException('fail to find matching account');
    }
    const credentials = await this.tokenService.createLoginCredentials(
      user as UserDocument,
    );

    return credentials;
  }
  async sendForgotPassword(data: SendForgotPasswordDTO): Promise<string> {
    const { email } = data;

    const user = await this.userRepository.findOne({
      filter: {
        email,
        confirmedAt: { $exists: true },
        provider: providerEnum.SYSTEM,
      },
    });

    if (!user) {
      throw new NotFoundException('Invalid account');
    }

    await this.otpRepository.deleteMany({
      filter: { createdBy: user._id, type: OtpEnum.ResetPassword },
    });

    await this.createResetPasswordOtp(user._id);

    return 'Done';
  }
  async verifyForgotPassword(data: VerifyForgotPasswordDTO): Promise<string> {
    const { email, otp } = data;

    const user = await this.userRepository.findOne({
      filter: { email, provider: providerEnum.SYSTEM },
    });
    if (!user) throw new NotFoundException('Invalid account');

    const otpDoc = await this.otpRepository.findOne({
      filter: { createdBy: user._id, type: OtpEnum.ResetPassword },
    });

    if (!otpDoc) throw new BadRequestException('OTP expired or not found');

    const valid = await this.secuirtyService.compareHash(otp, otpDoc.otp);
    if (!valid) {
      throw new ConflictException('Invalid OTP');
    }
    return 'Done';
  }
  async resetForgotPassword(data: ResetForgotPasswordDTO): Promise<string> {
    const { email, otp, password } = data;

    const user = await this.userRepository.findOne({
      filter: { email, provider: providerEnum.SYSTEM },
    });
    if (!user) {
      throw new NotFoundException('Invalid account');
    }

    const otpDoc = await this.otpRepository.findOne({
      filter: { createdBy: user._id, type: OtpEnum.ResetPassword },
    });
    if (!otpDoc) {
      throw new BadRequestException('OTP expired or not found');
    }

    const valid = await this.secuirtyService.compareHash(otp, otpDoc.otp);
    if (!valid) {
      throw new ConflictException('Invalid OTP');
    }

    user.password = password;
    user.changeCredentialsTime = new Date();
    await user.save();

    await this.otpRepository.deleteOne({ filter: { _id: otpDoc._id } });

    return 'Done';
  }
  async signupWithGmail(data: GmailDTO): Promise<LoginCredentialsResponse> {
    const { idToken } = data;
    const googleAccount = await this.verifyGoogleAccount(idToken);
    const { email, family_name, given_name, picture } = googleAccount;

    const user = await this.userRepository.findOne({ filter: { email } });
    if (user) {
      if (user.provider === providerEnum.GOOGLE) {
        return this.loginWithGmail(data);
      }
      throw new ConflictException('Email already exists');
    }

    const [newUser] = await this.userRepository.create({
      data: [
        {
          firstName: given_name,
          lastName: family_name,
          profileImage: picture,
          email,
          confirmedAt: new Date(),
          provider: providerEnum.GOOGLE,
        },
      ],
    });

    if (!newUser) throw new BadRequestException('Fail to signup with gmail');

    return this.tokenService.createLoginCredentials(newUser);
  }
  async loginWithGmail(data: GmailDTO): Promise<LoginCredentialsResponse> {
    const { idToken } = data;
    const { email } = await this.verifyGoogleAccount(idToken);

    const user = await this.userRepository.findOne({
      filter: { email, provider: providerEnum.GOOGLE },
    });
    if (!user) throw new NotFoundException('Invalid login data or provider');

    return this.tokenService.createLoginCredentials(user as UserDocument);
  }
}
