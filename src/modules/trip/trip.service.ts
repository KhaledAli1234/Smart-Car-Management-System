import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TripRepository } from 'src/DB';
import { CreateTripDTO, UpdateTripDTO } from './dto/trip.dto';
import { Types } from 'mongoose';

@Injectable()
export class TripService {
  constructor(private readonly tripRepository: TripRepository) {}

  async createTrip(data: CreateTripDTO): Promise<string> {
    const trip = await this.tripRepository.create({
      data: [
        {
          ...data,
          driver: new Types.ObjectId(data.driver),
        },
      ],
    });

    if (!trip.length) {
      throw new BadRequestException('fail to create trip');
    }

    return 'Done';
  }

  async getTrip(tripId: string) {
    const trip = await this.tripRepository.findOne({
      filter: { _id: new Types.ObjectId(tripId) },
      options: {
        populate: [{ path: 'driver', select: 'email username' }],
      },
    });

    if (!trip) {
      throw new NotFoundException('trip not found');
    }

    return trip;
  }

  async getUserTrips(userId: string) {
    return this.tripRepository.find({
      filter: { driver: new Types.ObjectId(userId) },
      options: { sort: { createdAt: -1 } },
    });
  }

  async updateTrip(tripId: string, data: UpdateTripDTO): Promise<string> {
    const trip = await this.tripRepository.findOne({
      filter: { _id: new Types.ObjectId(tripId) },
    });

    if (!trip) {
      throw new NotFoundException('trip not found');
    }

    Object.assign(trip, data);
    await trip.save();

    return 'Done';
  }

  async confirmTrip(tripId: string): Promise<string> {
    const trip = await this.tripRepository.findOne({
      filter: { _id: new Types.ObjectId(tripId) },
    });

    if (!trip) {
      throw new NotFoundException('trip not found');
    }

    trip.confirmed = true;
    await trip.save();

    return 'Done';
  }

  async deleteTrip(tripId: string): Promise<string> {
    const deleted = await this.tripRepository.deleteOne({
      filter: { _id: new Types.ObjectId(tripId) },
    });

    if (!deleted.deletedCount) {
      throw new NotFoundException('trip not found');
    }

    return 'Done';
  }
}
