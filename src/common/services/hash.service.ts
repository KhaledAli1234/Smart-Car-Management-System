import { Injectable } from '@nestjs/common';
import { compareHash, generatHash } from '../utils';

@Injectable()
export class SecuirtyService {
  constructor() {}

  generatHash = generatHash;
  compareHash = compareHash;
}
