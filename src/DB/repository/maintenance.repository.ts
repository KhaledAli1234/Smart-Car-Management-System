import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MaintenanceDocument as TDocument, Maintenance } from '../models';

@Injectable()
export class MaintenanceRepository extends DatabaseRepository<Maintenance> {
  constructor(
    @InjectModel(Maintenance.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
