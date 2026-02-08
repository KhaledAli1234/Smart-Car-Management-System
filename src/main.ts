import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import path from 'node:path';
import { LoggingInterceptor, PreferredLanguageInterceptor } from './common';

async function bootstrap() {
  const port = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix('api');
  app.use('/order/webhook', express.raw({ type: 'application/json' }));
  app.use('/uploads', express.static(path.resolve('./uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new PreferredLanguageInterceptor(),
  );

  await app.listen(port, () => {
    console.log(`server is running on port ${port} 🚀`);
  });
}
bootstrap();
