import { Module } from '@nestjs/common';
import { AuthenticationModule  } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TripModule } from './modules/trip/trip.module';
import { MaintenanceModule } from './modules/maintenance/maintenance.module';
import { SharedAuthenticationModule } from './common';
import { FuelModule } from './modules/fuel/fuel.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AlertModule } from './modules/alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: resolve('./config/.env.development.local'),
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI as string),
    AuthenticationModule,
    SharedAuthenticationModule,
    UserModule,
    TripModule,
    MaintenanceModule,
    FuelModule,
    DashboardModule,
    AlertModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
