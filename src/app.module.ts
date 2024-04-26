import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MenuCategoryModule } from './menu-category/menu-category.module';
import { MenuItemModule } from './menu-item/menu-item.module';
import { DatabaseModule } from './database/database.module';
import { validate } from './utils/env.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
    DatabaseModule,
    MenuCategoryModule,
    MenuItemModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
