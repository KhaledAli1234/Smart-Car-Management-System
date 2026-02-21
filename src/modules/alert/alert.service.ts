import { Injectable } from '@nestjs/common';
import { DashboardService } from '../dashboard/dashboard.service';
import {
  AlertSeverityEnum,
  AlertTypeEnum,
  RiskLevelEnum,
} from 'src/common/enums';
import { IAlert } from 'src/common';

@Injectable()
export class AlertService {
  constructor(private readonly dashboardService: DashboardService) {}

  async generateAlerts(userId: string): Promise<IAlert[]> {
    const dashboard = await this.dashboardService.getDashboard(userId);

    const alerts: IAlert[] = [];

    if (dashboard.maintenance?.riskLevel === RiskLevelEnum.HIGH) {
      alerts.push({
        type: AlertTypeEnum.MAINTENANCE,
        message: `You have ${dashboard.maintenance.upcomingCount} upcoming maintenances!`,
        severity: AlertSeverityEnum.HIGH,
      });
    } else if (dashboard.maintenance?.riskLevel === RiskLevelEnum.MEDIUM) {
      alerts.push({
        type: AlertTypeEnum.MAINTENANCE,
        message: `You have ${dashboard.maintenance.upcomingCount} upcoming maintenances.`,
        severity: AlertSeverityEnum.MEDIUM,
      });
    }

    if (dashboard.fuel?.consumption > 15) {
      alerts.push({
        type: AlertTypeEnum.FUEL,
        message: `High fuel consumption detected: ${dashboard.fuel.consumption} L/100km.`,
        severity: AlertSeverityEnum.MEDIUM,
      });
    }

    if (dashboard.healthScore < 50) {
      alerts.push({
        type: AlertTypeEnum.HEALTH,
        message: `Your vehicle health is low: ${dashboard.healthScore}%`,
        severity: AlertSeverityEnum.HIGH,
      });
    } else if (dashboard.healthScore < 70) {
      alerts.push({
        type: AlertTypeEnum.HEALTH,
        message: `Vehicle health is moderate: ${dashboard.healthScore}%`,
        severity: AlertSeverityEnum.MEDIUM,
      });
    }

    const streak = dashboard.streak;

    if (streak) {
      const bestStreak = Math.max(
        streak.safeDriving ?? 0,
        streak.maintenance ?? 0,
      );

      if (bestStreak > 0 && bestStreak % 7 === 0) {
        alerts.push({
          type: AlertTypeEnum.STREAK,
          message: `🔥 Amazing! You reached a ${bestStreak}-day streak!`,
          severity: AlertSeverityEnum.LOW,
        });
      }

      if (bestStreak >= 30) {
        alerts.push({
          type: AlertTypeEnum.STREAK,
          message: `🏆 Incredible! ${bestStreak} day streak!`,
          severity: AlertSeverityEnum.LOW,
        });
      }

      if (bestStreak === 0) {
        alerts.push({
          type: AlertTypeEnum.STREAK,
          message: `Your streak stopped. Start again today 💪`,
          severity: AlertSeverityEnum.MEDIUM,
        });
      }
    }

    return alerts;
  }
}
