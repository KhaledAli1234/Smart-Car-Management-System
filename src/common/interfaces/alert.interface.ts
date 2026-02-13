import { AlertSeverityEnum, AlertTypeEnum } from '../enums';

export interface IAlert {
  type: AlertTypeEnum;
  message: string;
  severity: AlertSeverityEnum;
  createdAt?: Date;
}
