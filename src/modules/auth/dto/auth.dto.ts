import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsMatch } from 'src/common';

export class SendForgotPasswordDTO {
  @IsEmail()
  email: string;
}

export class VerifyForgotPasswordDTO extends SendForgotPasswordDTO {
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class ResetForgotPasswordDTO extends VerifyForgotPasswordDTO {
  @IsString()
  @MinLength(6)
  password: string;
}

export class ResendConfirmEmailDTO {
  @IsEmail()
  email: string;
}
export class ConfirmEmailDTO extends ResendConfirmEmailDTO {
  @Matches(/^\d{6}$/)
  otp: string;
}

export class LoginBodyDTO extends ResendConfirmEmailDTO {
  @IsStrongPassword()
  password: string;
}

export class SignupBodyDTO extends LoginBodyDTO {
  @Length(2, 52)
  @IsNotEmpty()
  @IsString()
  username: string;
  @ValidateIf((data: SignupBodyDTO) => {
    return Boolean(data.password);
  })
  @IsMatch<string>(['password'])
  confirmPassword: string;
}

export class GmailDTO {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
