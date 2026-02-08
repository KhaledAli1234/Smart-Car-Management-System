import {
  Body,
  Controller,
  HttpCode,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthenticationService } from './auth.service';
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
import { LoginResponse } from './entities';
import { IResponse, successResponse } from 'src/common';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  async signup(@Body() body: SignupBodyDTO): Promise<IResponse> {
    await this.authenticationService.signup(body);
    return successResponse();
  }

  @Post('resend-confirm-email')
  async resendConfirmEmail(
    @Body() body: ResendConfirmEmailDTO,
  ): Promise<IResponse> {
    await this.authenticationService.resendConfirmEmail(body);
    return successResponse();
  }

  @Patch('confirm-Email')
  async confirmEmail(@Body() body: ConfirmEmailDTO): Promise<IResponse> {
    await this.authenticationService.confirmEmail(body);
    return successResponse();
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginBodyDTO): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authenticationService.login(body);
    return successResponse<LoginResponse>({ data: { credentials } });
  }

  @Patch('send-forgot-password')
  async sendForgotPassword(
    @Body() body: SendForgotPasswordDTO,
  ): Promise<IResponse> {
    await this.authenticationService.sendForgotPassword(body);
    return successResponse();
  }

  @Patch('verify-forgot-password')
  async verifyForgotPassword(
    @Body() body: VerifyForgotPasswordDTO,
  ): Promise<IResponse> {
    await this.authenticationService.verifyForgotPassword(body);
    return successResponse();
  }

  @Patch('reset-forgot-password')
  async resetForgotPassword(
    @Body() body: ResetForgotPasswordDTO,
  ): Promise<IResponse> {
    await this.authenticationService.resetForgotPassword(body);
    return successResponse();
  }

  @Post('signup-gmail')
  async signupWithGmail(
    @Body() body: GmailDTO,
  ): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authenticationService.signupWithGmail(body);
    return successResponse<LoginResponse>({ data: { credentials } });
  }

  @Post('login-gmail')
  async loginWithGmail(
    @Body() body: GmailDTO,
  ): Promise<IResponse<LoginResponse>> {
    const credentials = await this.authenticationService.loginWithGmail(body);
    return successResponse<LoginResponse>({ data: { credentials } });
  }
}
