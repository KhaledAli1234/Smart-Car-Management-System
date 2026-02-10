import { Module } from '@nestjs/common';
import { AuthenticationService } from './auth.service';
import { AuthenticationController } from './auth.controller';
import { OtpRepository } from 'src/DB/repository/otp.repository';
import { SecuirtyService } from 'src/common';
import { OtpModel } from 'src/DB';

@Module({
  imports: [OtpModel],
  controllers: [AuthenticationController],
  providers: [OtpRepository, SecuirtyService, AuthenticationService],
})
export class AuthenticationModule {}
