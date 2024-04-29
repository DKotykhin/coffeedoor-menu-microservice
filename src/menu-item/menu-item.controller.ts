import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { MenuItemService } from './menu-item.service';
import { MenuItem } from './entities/menu-item.entity';
import {
  ChangeMenuItemPositionRequest,
  CreateMenuItemRequest,
  MENU_ITEM_SERVICE_NAME,
  MenuItemServiceControllerMethods,
  StatusResponse,
  UpdateMenuItemRequest,
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
    createMenuItemDto: CreateMenuItemRequest,
  ): Promise<MenuItem> {
    this.logger.log('Received createMenuItem request');
    return await this.menuItemService.create(createMenuItemDto);
  }

  // @MessagePattern('updateMenuItem')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'UpdateMenuItem')
  async updateMenuItem(
    updateMenuItemDto: UpdateMenuItemRequest,
  ): Promise<MenuItem> {
    this.logger.log('Received updateMenuItem request');
    return await this.menuItemService.update(updateMenuItemDto);
  }

  // @MessagePattern('changeMenuItemPosition')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'ChangeMenuItemPosition')
  async changeMenuItemPosition(
    changeMenuItemPositionDto: ChangeMenuItemPositionRequest,
  ): Promise<MenuItem> {
    this.logger.log('Received changeMenuItemPosition request');
    return await this.menuItemService.changePosition(changeMenuItemPositionDto);
  }

  // @MessagePattern('removeMenuItem')
  @GrpcMethod(MENU_ITEM_SERVICE_NAME, 'DeleteMenuItem')
  async deleteMenuItem({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received removeMenuItem request');
    return await this.menuItemService.remove(id);
  }
}
