import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { StreakRepository } from 'src/DB';
import { CreateStreakDTO, UpdateStreakDTO } from './dto/streak.dto';
import { IStreak } from 'src/common';

@Injectable()
export class StreakService {
  constructor(private readonly streakRepository: StreakRepository) {}

  async createStreak(data: CreateStreakDTO): Promise<string> {
    const streak = await this.streakRepository.create({
      data: [{ ...data, user: new Types.ObjectId(data.user) }],
    });
    if (!streak.length) throw new NotFoundException('Fail to create streak');
    return 'Done';
  }

  async getUserStreak(userId: string): Promise<IStreak> {
    const streak = await this.streakRepository.findOne({
      filter: { user: new Types.ObjectId(userId) },
    });
    if (!streak) throw new NotFoundException('Streak not found');
    return streak;
  }

  async updateStreak(id: string, data: Partial<IStreak>): Promise<string> {
    Object.keys(data).forEach((key) => {
      if (data[key] === undefined || key === '_id' || key === '__v') {
        delete data[key];
      }
    });

    const streak = await this.streakRepository.findOneAndUpdate({
      filter: { _id: new Types.ObjectId(id) },
      update: { $set: data },
      options: { new: true },
    });

    if (!streak) throw new NotFoundException('Streak not found');

    return 'Done';
  }

  async deleteStreak(id: string): Promise<string> {
    const deleted = await this.streakRepository.deleteOne({
      filter: { _id: new Types.ObjectId(id) },
    });
    if (!deleted.deletedCount) throw new NotFoundException('Streak not found');
    return 'Done';
  }
  async incrementSafeDriving(userId: string) {
    const streak = await this.getUserStreak(userId);
    const updatedFields = {
      safeDrivingStreak: streak.safeDrivingStreak + 1,
      badges: this.calculateBadges({
        ...streak,
        safeDrivingStreak: streak.safeDrivingStreak + 1,
      }),
    };
    await this.updateStreak(streak._id!.toString(), updatedFields);
  }

  async incrementMaintenance(userId: string) {
    const streak = await this.getUserStreak(userId);
    const updatedFields = {
      maintenanceStreak: streak.maintenanceStreak + 1,
      badges: this.calculateBadges({
        ...streak,
        maintenanceStreak: streak.maintenanceStreak + 1,
      }),
    };
    await this.updateStreak(streak._id!.toString(), updatedFields);
  }

  private calculateBadges(streak: IStreak): number {
    let badges = 0;
    if (streak.safeDrivingStreak >= 7) badges += 1;
    if (streak.maintenanceStreak >= 5) badges += 1;
    return badges;
  }
}
