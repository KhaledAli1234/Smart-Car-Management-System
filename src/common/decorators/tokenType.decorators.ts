import { SetMetadata } from '@nestjs/common';
import { TokenEnum } from '../enums';

export const tokenName = 'tokenType';
export const Token = (type: TokenEnum = TokenEnum.access) => {
  return SetMetadata(tokenName, type);
};
