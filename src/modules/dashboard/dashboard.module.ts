import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  FuelModel,
  FuelRepository,
  MaintenanceModel,
  MaintenanceRepository,
  StreakModel,
  StreakRepository,
  TripModel,
  TripRepository,
} from 'src/DB';
import { redisProvider } from 'src/common';
import { AIAdvisorController } from './ai-advisor.controller';

@Module({
  imports: [TripModel, MaintenanceModel, FuelModel , StreakModel],
  controllers: [DashboardController , AIAdvisorController],
  providers: [
    DashboardService,
    TripRepository,
    FuelRepository,
    MaintenanceRepository,
    StreakRepository
    // redisProvider
  ],
  exports: [DashboardService],
})
export class DashboardModule {}
