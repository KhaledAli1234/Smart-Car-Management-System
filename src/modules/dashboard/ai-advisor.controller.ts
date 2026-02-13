import { Controller, Get, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';

@Controller('ai-advisor')
export class AIAdvisorController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('dashboard/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getDashboardForAI(@Param('userId') userId: string): Promise<IResponse> {
    const aiData = await this.dashboardService.getDashboardForAI(userId);
    return successResponse({ data: { aiData } });
  }
}
