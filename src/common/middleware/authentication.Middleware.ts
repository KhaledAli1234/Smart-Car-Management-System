import { BadRequestException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { IAuthRequest } from '../interfaces/token.interface';

export const preAuth = async (
  req: IAuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!(req.headers.authorization?.split(' ')?.length == 2)) {
    throw new BadRequestException('Missing authorization key');
  }
  next();
};
