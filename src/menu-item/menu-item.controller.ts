import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StatusResponseDto } from '../types/status-response';
import { LanguageCode as LanguageCodeDB } from '../database/db.enums';
import { MenuItemService } from './menu-item.service';
import {
  ChangeMenuItemPositionDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/_index';
import { MenuItem } from './entities/menu-item.entity';
import {
  MENU_ITEM_SERVICE_NAME,
  LanguageCode,
  MenuItemServiceControllerMethods,
} from './menu-item.pb';

@MenuItemServiceControllerMethods()
@Controller()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}
  protected readonly logger = new Logger(MenuItemController.name);

  // @MessagePattern('findMenuItemsByCategoryId')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'GetMenuItemsByCategoryId')
  async getMenuItemsByCategoryId({
    categoryId,
  }: {
    categoryId: string;
  }): Promise<{ items: MenuItem[] }> {
    this.logger.log('Received findMenuItemsByCategoryId request');
    const items =
      await this.menuItemService.getMenuItemsByCategoryId(categoryId);
    return { items };
  }

  // @MessagePattern('findMenuItemById')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'GetMenuItemById')
  async getMenuItemById({ id }: { id: string }): Promise<MenuItem> {
    this.logger.log('Received findMenuItemById request');
    return await this.menuItemService.findById(id);
  }

  // @MessagePattern('createMenuItem')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'CreateMenuItem')
  async createMenuItem(
    createMenuItemDto: CreateMenuItemDto,
  ): Promise<MenuItem> {
    this.logger.log('Received createMenuItem request');
    return await this.menuItemService.create({
      ...createMenuItemDto,
      language: LanguageCode[
        createMenuItemDto.language
      ] as unknown as LanguageCodeDB,
    });
  }

  // @MessagePattern('updateMenuItem')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'UpdateMenuItem')
  async updateMenuItem(
    updateMenuItemDto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    this.logger.log('Received updateMenuItem request');
    return await this.menuItemService.update(updateMenuItemDto);
  }

  // @MessagePattern('changeMenuItemPosition')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'ChangeMenuItemPosition')
  async changeMenuItemPosition(
    changeMenuItemPositionDto: ChangeMenuItemPositionDto,
  ): Promise<MenuItem> {
    this.logger.log('Received changeMenuItemPosition request');
    return await this.menuItemService.changePosition(changeMenuItemPositionDto);
  }

  // @MessagePattern('removeMenuItem')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'DeleteMenuItem')
  async deleteMenuItem({ id }: { id: string }): Promise<StatusResponseDto> {
    this.logger.log('Received removeMenuItem request');
    return await this.menuItemService.remove(id);
  }
}
