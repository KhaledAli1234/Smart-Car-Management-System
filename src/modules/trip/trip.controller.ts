import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDTO, UpdateTripDTO } from './dto/trip.dto';
import { IResponse, successResponse } from 'src/common';
import { Auth } from 'src/common/decorators';
import { RoleEnum } from 'src/common/enums';

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  @Auth([RoleEnum.user])
  async createTrip(@Body() body: CreateTripDTO): Promise<IResponse> {
    await this.tripService.createTrip(body);
    return successResponse();
  }

  @Get(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getTrip(@Param('id') id: string): Promise<IResponse> {
    const trip = await this.tripService.getTrip(id);
    return successResponse({ data: { trip } });
  }

  @Get('user/:userId')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async getUserTrips(@Param('userId') userId: string): Promise<IResponse> {
    const trips = await this.tripService.getUserTrips(userId);
    return successResponse({ data: { trips } });
  }

  @Patch(':id')
  @Auth([RoleEnum.user, RoleEnum.admin])
  async updateTrip(
    @Param('id') id: string,
    @Body() body: UpdateTripDTO,
  ): Promise<IResponse> {
    await this.tripService.updateTrip(id, body);
    return successResponse();
  }

  @Patch(':id/confirm')
  @Auth([RoleEnum.admin])
  async confirmTrip(@Param('id') id: string): Promise<IResponse> {
    await this.tripService.confirmTrip(id);
    return successResponse();
  }

  @Delete(':id')
  @Auth([RoleEnum.admin])
  async deleteTrip(@Param('id') id: string): Promise<IResponse> {
    await this.tripService.deleteTrip(id);
    return successResponse();
  }
}
