import { Controller, Get, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { AlertService } from './alert.service';
import { Auth, IAlert, IResponse, RoleEnum, successResponse } from 'src/common';

@UsePipes(new ValidationPipe({ whitelist: true }))
@Controller('alerts')
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get(':userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getAlerts(@Param('userId') userId: string): Promise<IResponse> {
    const alerts: IAlert[] = await this.alertService.generateAlerts(userId);
    return successResponse({ data: { alerts } });
  }
}
