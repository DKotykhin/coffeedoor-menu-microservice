import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

import { AppModule } from './app.module';

const logger = new Logger('main.ts');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  const configService = app.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: HOST,
      port: PORT,
    },
  });
  await app.startAllMicroservices();
  logger.log(`Menu microservice is running on ${HOST}:${PORT}`);
}
bootstrap();
