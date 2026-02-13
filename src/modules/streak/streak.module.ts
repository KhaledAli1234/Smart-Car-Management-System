import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { StreakController } from './streak.controller';
import { StreakModel, StreakRepository } from 'src/DB';

@Module({
  imports: [StreakModel],
  controllers: [StreakController],
  providers: [StreakService, StreakRepository],
})
export class StreakModule {}
