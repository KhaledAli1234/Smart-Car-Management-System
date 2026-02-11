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

  @Auth([RoleEnum.user])
  @Post()
  async createFuel(@Body() body: CreateFuelDTO): Promise<IResponse> {
    await this.fuelService.createFuel(body);
    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get(':id')
  async getFuel(@Param('id') id: string): Promise<IResponse> {
    const fuel = await this.fuelService.getFuel(id);
    return successResponse({ data: { fuel } });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('user/:userId')
  async getUserFuel(@Param('userId') userId: string): Promise<IResponse> {
    const fuelRecords = await this.fuelService.getUserFuel(userId);
    return successResponse({ data: { fuelRecords } });
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Patch(':id')
  async updateFuel(
    @Param('id') id: string,
    @Body() body: UpdateFuelDTO,
  ): Promise<IResponse> {
    await this.fuelService.updateFuel(id, body);
    return successResponse();
  }

  @Auth([RoleEnum.admin])
  @Delete(':id')
  async deleteFuel(@Param('id') id: string): Promise<IResponse> {
    await this.fuelService.deleteFuel(id);
    return successResponse();
  }

  @Auth([RoleEnum.user, RoleEnum.admin])
  @Get('consumption/:userId')
  async getFuelConsumption(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const consumption = await this.fuelService.calculateConsumption(userId);
    return successResponse({ data: { consumption } });
  }
}
