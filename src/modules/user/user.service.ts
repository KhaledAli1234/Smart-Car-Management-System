import { Injectable } from '@nestjs/common';
import { UserDocument, UserRepository } from 'src/DB';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async profile(user: UserDocument): Promise<UserDocument> {
    const profile = (await this.userRepository.findOne({
      filter: { _id: user._id },
      options: { populate: [{ path: 'wishlist' }] },
    })) as UserDocument;
    return profile;
  }
}
