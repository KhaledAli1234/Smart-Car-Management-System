import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FuelDocument as TDocument, Fuel } from '../models';

@Injectable()
export class FuelRepository extends DatabaseRepository<Fuel> {
  constructor(
    @InjectModel(Fuel.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
