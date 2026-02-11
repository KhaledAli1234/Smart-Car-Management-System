import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { MaintenanceRepository } from 'src/DB';
import {
  CreateMaintenanceDTO,
  UpdateMaintenanceDTO,
} from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private readonly maintenanceRepository: MaintenanceRepository) {}

  async createMaintenance(data: CreateMaintenanceDTO): Promise<string> {
    const record = await this.maintenanceRepository.create({
      data: [
        {
          ...data,
          user: new Types.ObjectId(data.user),
        },
      ],
    });

    if (!record.length) {
      throw new BadRequestException('fail to create maintenance');
    }

    return 'Done';
  }

  async getUserMaintenance(userId: string) {
    return this.maintenanceRepository.find({
      filter: { user: new Types.ObjectId(userId) },
      options: { sort: { performedAt: -1 } },
    });
  }

  async getUpcomingMaintenance(userId: string) {
    return this.maintenanceRepository.find({
      filter: {
        user: new Types.ObjectId(userId),
        nextMaintenanceAt: { $gte: new Date() },
      },
      options: { sort: { nextMaintenanceAt: 1 } },
    });
  }

  async getMaintenance(id: string) {
    const record = await this.maintenanceRepository.findOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!record) {
      throw new NotFoundException('maintenance not found');
    }

    return record;
  }

  async updateMaintenance(
    id: string,
    data: UpdateMaintenanceDTO,
  ): Promise<string> {
    
    Object.keys(data).forEach(
      (key) => data[key] === undefined && delete data[key],
    );

    const record = await this.maintenanceRepository.findOneAndUpdate({
      filter: { _id: new Types.ObjectId(id) },
      update: { $set: data },
    });

    if (!record) {
      throw new NotFoundException('maintenance not found');
    }

    return 'Done';
  }

  async deleteMaintenance(id: string): Promise<string> {
    const deleted = await this.maintenanceRepository.deleteOne({
      filter: { _id: new Types.ObjectId(id) },
    });

    if (!deleted.deletedCount) {
      throw new NotFoundException('maintenance not found');
    }

    return 'Done';
  }
}
