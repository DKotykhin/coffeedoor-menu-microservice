import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AppModule } from './app.module';
import { MENU_CATEGORY_PACKAGE_NAME } from './menu-category/menu-category.pb';
import { MENU_ITEM_PACKAGE_NAME } from './menu-item/menu-item.pb';
import { HEALTH_CHECK_PACKAGE_NAME } from './health-check/health-check.pb';

const logger = new Logger('main.ts');

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);
  const PORT = configService.get<string>('TRANSPORT_PORT');
  const HOST = configService.get<string>('TRANSPORT_HOST');
  const URL = `${HOST}:${PORT}`;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: [
          MENU_CATEGORY_PACKAGE_NAME,
          MENU_ITEM_PACKAGE_NAME,
          HEALTH_CHECK_PACKAGE_NAME,
        ],
        protoPath: [
          join(__dirname, '../proto/menu-category.proto'),
          join(__dirname, '../proto/menu-item.proto'),
          join(__dirname, '../proto/health-check.proto'),
        ],
        url: URL,
      },
    },
  );
  await app.listen();
  logger.log('Menu microservice is running on ' + URL);
}
bootstrap();
