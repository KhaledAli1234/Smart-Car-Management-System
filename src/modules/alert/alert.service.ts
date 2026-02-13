import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { DashboardService } from '../dashboard/dashboard.service';
import { RiskLevelEnum } from 'src/common/enums';

export interface IAlert {
  type: 'MAINTENANCE' | 'FUEL' | 'HEALTH';
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

@Injectable()
export class AlertService {
  constructor(private readonly dashboardService: DashboardService) {}

  async generateAlerts(userId: string): Promise<IAlert[]> {
    const dashboard = await this.dashboardService.getDashboard(userId);
    const alerts: IAlert[] = [];

    if (dashboard.maintenance.riskLevel === RiskLevelEnum.HIGH) {
      alerts.push({
        type: 'MAINTENANCE',
        message: `You have ${dashboard.maintenance.upcomingCount} upcoming maintenances!`,
        severity: 'HIGH',
      });
    } else if (dashboard.maintenance.riskLevel === RiskLevelEnum.MEDIUM) {
      alerts.push({
        type: 'MAINTENANCE',
        message: `You have ${dashboard.maintenance.upcomingCount} upcoming maintenances.`,
        severity: 'MEDIUM',
      });
    }

    if (dashboard.fuel.consumption > 15) {
      alerts.push({
        type: 'FUEL',
        message: `High fuel consumption detected: ${dashboard.fuel.consumption} L/100km.`,
        severity: 'MEDIUM',
      });
    }

    if (dashboard.healthScore < 50) {
      alerts.push({
        type: 'HEALTH',
        message: `Your vehicle health is low: ${dashboard.healthScore}%`,
        severity: 'HIGH',
      });
    } else if (dashboard.healthScore < 70) {
      alerts.push({
        type: 'HEALTH',
        message: `Vehicle health is moderate: ${dashboard.healthScore}%`,
        severity: 'MEDIUM',
      });
    }

    return alerts;
  }
}
