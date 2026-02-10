import { Global, Module } from '@nestjs/common';
import { TokenModel, TokenRepository, UserModel, UserRepository } from 'src/DB';
import { TokenService } from 'src/common';
import { JwtService } from '@nestjs/jwt';
// import { createClient } from 'redis';
@Global()
@Module({
  imports: [UserModel, TokenModel],
  controllers: [],
  providers: [
    UserRepository,
    JwtService,
    TokenService,
    TokenRepository,
    // {
    //   provide: 'REDIS_CLIENT',
    //   useFactory: async () => {
    //     const client = createClient({
    //       url: 'redis://localhost:6379',
    //       socket: {
    //         reconnectStrategy: false,
    //       },
    //     });

    //     client.on('error', (err) => {
    //       console.error(
    //         '❌ Redis Error - continuing without Redis:',
    //         err?.message,
    //       );
    //     });

    //     try {
    //       await client.connect();
    //       console.log('✅ Redis connected');
    //       return client;
    //     } catch (err) {
    //       console.warn('⚠️ Redis not available, running without Redis');
    //       return null;
    //     }
    //   },
    // },
  ],
  exports: [
    UserModel,
    TokenModel,
    UserRepository,
    JwtService,
    TokenService,
    TokenRepository,
  ],
})
export class SharedAuthenticationModule {}
