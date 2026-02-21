import { RiskLevelEnum } from '../enums';

export interface IDashboard {
  totalTrips: number;
  totalDistance: number;

  fuel: {
    totalCost: number;
    totalLiters: number;
    consumption: number;
  };

  maintenance: {
    totalRecords: number;
    upcomingCount: number;
    riskLevel: RiskLevelEnum;
  };
  streak?: {
    safeDriving: number;
    maintenance: number;
    badges: number;
  };

  healthScore: number;
  monthlyCost: number;
  monthlyCostByMonth?: Record<string, number>;
}
