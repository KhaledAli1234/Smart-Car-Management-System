import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { OtpRepository } from 'src/DB/repository/otp.repository';
import { SecuirtyService, TokenService } from 'src/common';
import { OtpModel, TokenModel, TokenRepository } from 'src/DB';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    OtpModel,
    UserModule,
    TokenModel,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    OtpRepository,
    SecuirtyService,
    TokenService,
    TokenRepository,
    AuthenticationService,
  ],
  exports: [AuthenticationService, TokenService],
})
export class AuthenticationModule {}
