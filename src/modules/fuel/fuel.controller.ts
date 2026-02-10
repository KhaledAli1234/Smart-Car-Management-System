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
import { FuelService } from './fuel.service';
import { CreateFuelDTO, UpdateFuelDTO } from './dto/fuel.dto';
import { Auth, IResponse, RoleEnum, successResponse } from 'src/common';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('fuel')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Post()
  @Auth([RoleEnum.user])
  async createFuel(@Body() body: CreateFuelDTO): Promise<IResponse> {
    await this.fuelService.createFuel(body);
    return successResponse();
  }

  @Get(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getFuel(@Param('id') id: string): Promise<IResponse> {
    const fuel = await this.fuelService.getFuel(id);
    return successResponse({ data: { fuel } });
  }

  @Get('user/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getUserFuel(@Param('userId') userId: string): Promise<IResponse> {
    const fuelRecords = await this.fuelService.getUserFuel(userId);
    return successResponse({ data: { fuelRecords } });
  }

  @Patch(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async updateFuel(
    @Param('id') id: string,
    @Body() body: UpdateFuelDTO,
  ): Promise<IResponse> {
    await this.fuelService.updateFuel(id, body);
    return successResponse();
  }

  @Delete(':id')
  @Auth([RoleEnum.admin])
  async deleteFuel(@Param('id') id: string): Promise<IResponse> {
    await this.fuelService.deleteFuel(id);
    return successResponse();
  }

  @Get('consumption/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getFuelConsumption(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const consumption = await this.fuelService.calculateConsumption(userId);
    return successResponse({ data: { consumption } });
  }
}
