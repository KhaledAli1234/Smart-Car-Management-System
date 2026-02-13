import { Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StreakDocument as TDocument, Streak } from '../models';

@Injectable()
export class StreakRepository extends DatabaseRepository<Streak> {
  constructor(
    @InjectModel(Streak.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }
}
