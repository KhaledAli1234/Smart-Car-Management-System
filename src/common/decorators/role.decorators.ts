import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../enums';

export const roleName = 'roles';
export const Roles = (accessRoles: RoleEnum[]) => {
  return SetMetadata(roleName, accessRoles);
};
