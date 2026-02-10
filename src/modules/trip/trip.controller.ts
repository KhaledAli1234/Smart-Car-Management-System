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

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post()
  async createTrip(@Body() body: CreateTripDTO): Promise<IResponse> {
    await this.tripService.createTrip(body);
    return successResponse();
  }

  @Get(':id')
  async getTrip(@Param('id') id: string): Promise<IResponse> {
    const trip = await this.tripService.getTrip(id);
    return successResponse({ data: { trip } });
  }

  @Get('user/:userId')
  async getUserTrips(
    @Param('userId') userId: string,
  ): Promise<IResponse> {
    const trips = await this.tripService.getUserTrips(userId);
    return successResponse({ data: { trips } });
  }

  @Patch(':id')
  async updateTrip(
    @Param('id') id: string,
    @Body() body: UpdateTripDTO,
  ): Promise<IResponse> {
    await this.tripService.updateTrip(id, body);
    return successResponse();
  }

  @Patch(':id/confirm')
  async confirmTrip(@Param('id') id: string): Promise<IResponse> {
    await this.tripService.confirmTrip(id);
    return successResponse();
  }

  @Delete(':id')
  async deleteTrip(@Param('id') id: string): Promise<IResponse> {
    await this.tripService.deleteTrip(id);
    return successResponse();
  }
}
