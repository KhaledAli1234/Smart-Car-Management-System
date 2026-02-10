import { Module } from '@nestjs/common';
import { AuthenticationModule  } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './modules/trip/trip.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.development.local'),
      isGlobal: true,
    }),
    // CacheModule.register({
    //   ttl:5000,
    //   isGlobal: true,
    // }),

    MongooseModule.forRoot(process.env.DB_URI as string),
    AuthenticationModule,
    UserModule,
    TripModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
