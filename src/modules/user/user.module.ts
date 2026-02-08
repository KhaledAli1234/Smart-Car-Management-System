import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel, UserRepository } from 'src/DB';
import { UserController } from './user.controller';
import { preAuth } from 'src/common';
import { AuthenticationModule } from '../auth/auth.module';

@Module({
  imports: [UserModel, forwardRef(() => AuthenticationModule)],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(preAuth).forRoutes(UserController);
  }
}
