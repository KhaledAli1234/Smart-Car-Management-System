import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { MaintenanceModel, MaintenanceRepository } from 'src/DB';

@Module({
  imports:[MaintenanceModel],
  controllers: [MaintenanceController],
  providers: [MaintenanceService , MaintenanceRepository],
})
export class MaintenanceModule {}
