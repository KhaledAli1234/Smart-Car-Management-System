import {
  Controller,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  Auth,
  IResponse,
  RoleEnum,
  successResponse,
  User,
} from 'src/common';
import type { UserDocument } from 'src/DB';
import { profileResponse } from './entities';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth([RoleEnum.user, RoleEnum.admin, RoleEnum.superAdmin])
  @Get()
  async profile(
    @User() user: UserDocument,
  ): Promise<IResponse<profileResponse>> {
    const profile = await this.userService.profile(user);
    return successResponse<profileResponse>({ data: { profile } });
  }
}