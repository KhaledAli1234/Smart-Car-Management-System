import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { FuelRepository, TripRepository } from 'src/DB';
import { CreateFuelDTO, UpdateFuelDTO } from './dto/fuel.dto';
import { IFuel } from 'src/common';

@Injectable()
export class FuelService {
  constructor(
    private readonly fuelRepository: FuelRepository,
    private readonly tripRepository: TripRepository,
  ) {}

  async createFuel(data: CreateFuelDTO): Promise<string> {
    const fuel = await this.fuelRepository.create({
      data: [{ ...data, user: new Types.ObjectId(data.user) }],
    });

    if (!fuel.length)
      throw new BadRequestException('fail to create fuel record');
    return 'Done';
  }

  async getFuel(id: string) {
    const fuel = await this.fuelRepository.findOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!fuel) throw new NotFoundException('fuel record not found');
    return fuel;
  }

  async getUserFuel(userId: string) {
    return this.fuelRepository.find({
      filter: { user: new Types.ObjectId(userId) },
      options: { sort: { date: -1 } },
    });
  }

  async updateFuel(id: string, data: UpdateFuelDTO): Promise<string> {
    const fuel = await this.fuelRepository.findOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!fuel) throw new NotFoundException('fuel record not found');

    Object.assign(fuel, data);
    await fuel.save();

    return 'Done';
  }

  async deleteFuel(id: string): Promise<string> {
    const deleted = await this.fuelRepository.deleteOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!deleted.deletedCount)
      throw new NotFoundException('fuel record not found');
    return 'Done';
  }

  async calculateConsumption(userId: string) {
    const fuels: IFuel[] = await this.fuelRepository.find({
      filter: { user: new Types.ObjectId(userId) },
      options: { sort: { createdAt: 1 } },
    });

    if (!fuels.length) return { totalKm: 0, totalLiters: 0, consumption: 0 };

    const totalKm = fuels.reduce(
      (sum: number, f: IFuel) => sum + (f.distance || 0),
      0,
    );

    const totalLiters = fuels.reduce(
      (sum: number, f: IFuel) => sum + (f.amount || 0),
      0,
    );

    const consumption = totalKm > 0 ? (totalLiters / totalKm) * 100 : 0;

    return { totalKm, totalLiters, consumption: +consumption.toFixed(2) };
  }
}
