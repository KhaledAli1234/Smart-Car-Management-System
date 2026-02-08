import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TripDocument as TDocument, Trip } from '../models';

@Injectable()
export class TripRepository extends DatabaseRepository<Trip> {
  constructor(
    @InjectModel(Trip.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
