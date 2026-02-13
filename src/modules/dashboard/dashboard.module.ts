import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  FuelModel,
  FuelRepository,
  MaintenanceModel,
  MaintenanceRepository,
  TripModel,
  TripRepository,
} from 'src/DB';
import { redisProvider } from 'src/common';

@Module({
  imports: [TripModel, MaintenanceModel, FuelModel],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    TripRepository,
    FuelRepository,
    MaintenanceRepository,
    // redisProvider
  ],
})
export class DashboardModule {}
