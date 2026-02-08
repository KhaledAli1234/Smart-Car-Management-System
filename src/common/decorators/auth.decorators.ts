import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleEnum, TokenEnum } from '../enums';
import { Token } from './tokenType.decorators';
import { Roles } from './role.decorators';
import { AuthorizationGuard } from '../guards/authorization/authorization.guard';
import { AuthenticationGuard } from '../guards/authentication/authentication.guard';

export function Auth(roles: RoleEnum[], type: TokenEnum = TokenEnum.access) {
  return applyDecorators(
    Token(type),
    Roles(roles),
    UseGuards(AuthenticationGuard, AuthorizationGuard),
  );
}
