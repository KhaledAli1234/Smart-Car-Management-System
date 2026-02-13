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

@Module({
  imports: [TripModel, MaintenanceModel, FuelModel],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    TripRepository,
    FuelRepository,
    MaintenanceRepository,
  ],
})
export class DashboardModule {}
