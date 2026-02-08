import { CreateOptions, Model } from 'mongoose';
import { DatabaseRepository } from './database.repository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument as TDocument, User } from '../models';

@Injectable()
export class UserRepository extends DatabaseRepository<User> {
  constructor(
    @InjectModel(User.name) protected override readonly model: Model<TDocument>,
  ) {
    super(model);
  }

  async createUser({
    data,
    options,
  }: {
    data: Partial<TDocument>[];
    options?: CreateOptions;
  }): Promise<TDocument> {
    const [user] = (await this.create({ data, options })) || [];
    if (!user) {
      throw new BadRequestException('fail to create user');
    }
    return user;
  }
}
