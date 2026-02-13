import { Inject, Injectable } from '@nestjs/common';
// import Redis from 'ioredis';
import { Types } from 'mongoose';
import { FuelRepository, MaintenanceRepository, TripRepository } from 'src/DB';
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
    // @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async getDashboard(userId: string): Promise<IDashboard> {
    // const cacheKey = `dashboard:${userId}`;
    // const cached = await this.redis.get(cacheKey);
    // if (cached) return JSON.parse(cached);

    const user = new Types.ObjectId(userId);

    const trips = (await this.tripRepository.find({
      filter: { user },
    })) as ITrip[];
    const totalTrips = trips.length;
    const totalDistance = trips.reduce<number>(
      (sum, trip) => sum + (trip.distance ?? 0),
      0,
    );

    const fuels = (await this.fuelRepository.find({
      filter: { user },
    })) as IFuel[];
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

    const maintenances = (await this.maintenanceRepository.find({
      filter: { user },
    })) as IMaintenance[];
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
    healthScore = Math.max(0, healthScore);

    const monthlyCost = totalFuelCost;

    const monthlyCostByMonth: Record<string, number> = {};
    fuels.forEach((fuel) => {
      const month = fuel.date?.toISOString().slice(0, 7);
      if (month)
        monthlyCostByMonth[month] =
          (monthlyCostByMonth[month] || 0) + fuel.cost;
    });

    const dashboard: IDashboard = {
      totalTrips,
      totalDistance,
      fuel: { totalCost: totalFuelCost, totalLiters, consumption },
      maintenance: {
        totalRecords: maintenances.length,
        upcomingCount: upcoming.length,
        riskLevel,
      },
      healthScore,
      monthlyCost,
      monthlyCostByMonth,
    };

    // await this.redis.set(cacheKey, JSON.stringify(dashboard), 'EX', 300);

    return dashboard;
  }
}
