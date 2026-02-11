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

  @Auth([RoleEnum.user])
  @Post()
  async createMaintenance(
    @Body() body: CreateMaintenanceDTO,
  ): Promise<IResponse> {
    await this.maintenanceService.createMaintenance(body);
    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get(':id')
  async getMaintenance(@Param('id') id: string): Promise<IResponse> {
    const maintenance = await this.maintenanceService.getMaintenance(id);
    return successResponse({ data: { maintenance } });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('user/:userId')
  async getUserMaintenance(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const maintenanceRecords =
      await this.maintenanceService.getUserMaintenance(userId);

    return successResponse({
      data: { maintenanceRecords },
    });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('upcoming/:userId')
  async getUpcomingMaintenance(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const upcoming =
      await this.maintenanceService.getUpcomingMaintenance(userId);

    return successResponse({ data: { upcoming } });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':id')
  async updateMaintenance(
    @Param('id') id: string,
    @Body() body: UpdateMaintenanceDTO,
  ): Promise<IResponse> {
    await this.maintenanceService.updateMaintenance(id, body);
    return successResponse();
  }

  @Auth([RoleEnum.admin])
  @Delete(':id')
  async deleteMaintenance(@Param('id') id: string): Promise<IResponse> {
    await this.maintenanceService.deleteMaintenance(id);
    return successResponse();
  }
}
