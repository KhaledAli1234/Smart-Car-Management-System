import { Module } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { FuelController } from './fuel.controller';
import { FuelModel, FuelRepository, TripModel, TripRepository } from 'src/DB';

@Module({
  imports:[FuelModel , TripModel],
  controllers: [FuelController],
  providers: [FuelService , FuelRepository , TripRepository],
})
export class FuelModule {}
