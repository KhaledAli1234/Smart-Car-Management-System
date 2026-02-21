import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { Redis } from 'ioredis';
import {
  FuelRepository,
  MaintenanceRepository,
  StreakRepository,
  TripRepository,
} from 'src/DB';
import {
  IDashboard,
  RiskLevelEnum,
  IFuel,
  IMaintenance,
  ITrip,
} from 'src/common';

@Injectable()
export class DashboardService {
  constructor(
    private readonly tripRepository: TripRepository,
    private readonly fuelRepository: FuelRepository,
    private readonly maintenanceRepository: MaintenanceRepository,
    private readonly streakRepository: StreakRepository,
    // private readonly redisClient: Redis,
  ) {}

  // private getCacheKey(userId: string) {
  //   return `dashboard:${userId}`;
  // }

  async getDashboard(userId: string): Promise<IDashboard> {
    // const cacheKey = this.getCacheKey(userId);
    // const cached = await this.redisClient.get(cacheKey);
    // if (cached) {
    //   return JSON.parse(cached);
    // }

    const user = new Types.ObjectId(userId);

    const trips = (await this.tripRepository.find({
      filter: { user },
    })) as ITrip[];
    const fuels = (await this.fuelRepository.find({
      filter: { user },
    })) as IFuel[];
    const maintenances = (await this.maintenanceRepository.find({
      filter: { user },
    })) as IMaintenance[];
    const streak = await this.streakRepository.findOne({
      filter: { user },
    });

    const totalTrips = trips.length;
    const totalDistance = trips.reduce<number>(
      (sum, trip) => sum + (trip.distance ?? 0),
      0,
    );
    const longTrips = trips.filter((t) => (t.distance ?? 0) > 100).length;

    const totalLiters = fuels.reduce<number>(
      (sum, fuel) => sum + (fuel.amount ?? 0),
      0,
    );
    const totalFuelCost = fuels.reduce<number>(
      (sum, fuel) => sum + (fuel.cost ?? 0),
      0,
    );
    const consumption =
      totalDistance > 0
        ? Number(((totalLiters / totalDistance) * 100).toFixed(2))
        : 0;

    const monthlyCostByMonth: { [month: string]: number } = {};
    fuels.forEach((fuel) => {
      const month = fuel.date
        ? new Date(fuel.date).toISOString().slice(0, 7)
        : 'unknown';
      monthlyCostByMonth[month] =
        (monthlyCostByMonth[month] || 0) + (fuel.cost ?? 0);
    });

    const upcoming = maintenances.filter(
      (m) => m.nextMaintenanceAt && m.nextMaintenanceAt > new Date(),
    );
    const riskLevel: RiskLevelEnum =
      upcoming.length >= 3
        ? RiskLevelEnum.HIGH
        : upcoming.length === 2
          ? RiskLevelEnum.MEDIUM
          : RiskLevelEnum.LOW;

    let healthScore = 100;
    if (consumption > 12) healthScore -= 20;
    if (riskLevel === RiskLevelEnum.MEDIUM) healthScore -= 15;
    if (riskLevel === RiskLevelEnum.HIGH) healthScore -= 30;
    if (longTrips > 3) healthScore -= 10;
    healthScore = Math.max(0, healthScore);

    const monthlyCost = totalFuelCost;

    const dashboard: IDashboard = {
      totalTrips,
      totalDistance,
      fuel: { totalCost: totalFuelCost, totalLiters, consumption },
      maintenance: {
        totalRecords: maintenances.length,
        upcomingCount: upcoming.length,
        riskLevel,
      },
      streak: {
        safeDriving: streak?.safeDrivingStreak ?? 0,
        maintenance: streak?.maintenanceStreak ?? 0,
        badges: streak?.badges ?? 0,
      },
      healthScore,
      monthlyCost,
      monthlyCostByMonth,
    };

    // await this.redisClient.set(cacheKey, JSON.stringify(dashboard), 'EX', 300);

    return dashboard;
  }

  async getDashboardForAI(userId: string) {
    const dashboard = await this.getDashboard(userId);

    return {
      totalTrips: dashboard.totalTrips,
      totalDistance: dashboard.totalDistance,
      fuelEfficiency: dashboard.fuel.consumption,
      upcomingMaintenance: dashboard.maintenance.upcomingCount,
      riskLevel: dashboard.maintenance.riskLevel,
      healthScore: dashboard.healthScore,
    };
  }
}
