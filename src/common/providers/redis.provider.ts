import Redis from 'ioredis';

export const redisProvider = {
  provide: 'REDIS',
  useFactory: () => {
    return new Redis({
      host: 'localhost',
      port: 6379,
    });
  },
};
