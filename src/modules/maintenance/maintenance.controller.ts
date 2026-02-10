import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import {
  CreateMaintenanceDTO,
  UpdateMaintenanceDTO,
} from './dto/maintenance.dto';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('maintenance')
export class MaintenanceController {
  constructor(private readonly maintenanceService: MaintenanceService) {}

  @Post()
  @Auth([RoleEnum.user])
  async createMaintenance(
    @Body() body: CreateMaintenanceDTO,
  ): Promise<IResponse> {
    await this.maintenanceService.createMaintenance(body);
    return successResponse();
  }

  @Get(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getMaintenance(@Param('id') id: string): Promise<IResponse> {
    const maintenance = await this.maintenanceService.getMaintenance(id);
    return successResponse({ data: { maintenance } });
  }

  @Get('user/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getUserMaintenance(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const maintenanceRecords =
      await this.maintenanceService.getUserMaintenance(userId);

    return successResponse({
      data: { maintenanceRecords },
    });
  }

  @Get('upcoming/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getUpcomingMaintenance(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const upcoming =
      await this.maintenanceService.getUpcomingMaintenance(userId);

    return successResponse({ data: { upcoming } });
  }

  @Patch(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async updateMaintenance(
    @Param('id') id: string,
    @Body() body: UpdateMaintenanceDTO,
  ): Promise<IResponse> {
    await this.maintenanceService.updateMaintenance(id, body);
    return successResponse();
  }

  @Delete(':id')
  @Auth([RoleEnum.admin])
  async deleteMaintenance(@Param('id') id: string): Promise<IResponse> {
    await this.maintenanceService.deleteMaintenance(id);
    return successResponse();
  }
}
