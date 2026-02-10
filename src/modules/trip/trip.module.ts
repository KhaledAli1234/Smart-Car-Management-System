import { Module } from '@nestjs/common';
import { TripService } from './trip.service';
import { TripController } from './trip.controller';
import { TripModel, TripRepository } from 'src/DB';

@Module({
  imports: [TripModel],
  controllers: [TripController],
  providers: [TripService, TripRepository],
})
export class TripModule {}
