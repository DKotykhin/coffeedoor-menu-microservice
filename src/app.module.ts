import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MenuCategoryModule } from './menu-category/menu-category.module';
import { validate } from './utils/env.validator';

@Module({
  imports: [
    MenuCategoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.stage.dev'],
      validate,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
