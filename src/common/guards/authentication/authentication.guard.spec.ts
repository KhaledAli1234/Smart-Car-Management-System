import { Reflector } from '@nestjs/core';
import { AuthenticationGuard } from './authentication.guard';
import { TokenService } from 'src/common/services';

describe('AuthenticationGuard', () => {
  it('should be defined', () => {
    const mockTokenService = {} as TokenService;
    const mockReflector = {} as Reflector;

    expect(
      new AuthenticationGuard(mockTokenService, mockReflector),
    ).toBeDefined();
  });
});
