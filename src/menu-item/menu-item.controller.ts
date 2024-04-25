import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { StatusResponseDto } from '../types/status-response';
import { MenuItemService } from './menu-item.service';
import {
  ChangeMenuItemPositionDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/_index';
import { MenuItem } from './entities/menu-item.entity';

@Controller()
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}
  protected readonly logger = new Logger(MenuItemController.name);

  @MessagePattern('findMenuItemsByCategoryId')
  findByLanguage(@Payload() categoryId: string): Promise<MenuItem[]> {
    this.logger.log('Received findMenuItemsByCategoryId request');
    return this.menuItemService.findAllByCategoryId(categoryId);
  }

  @MessagePattern('findMenuItemById')
  findById(@Payload() id: string): Promise<MenuItem> {
    this.logger.log('Received findMenuItemById request');
    return this.menuItemService.findById(id);
  }

  @MessagePattern('createMenuItem')
  create(@Payload() createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    this.logger.log('Received createMenuItem request');
    return this.menuItemService.create(createMenuItemDto);
  }

  @MessagePattern('updateMenuItem')
  update(@Payload() updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    this.logger.log('Received updateMenuItem request');
    return this.menuItemService.update(updateMenuItemDto);
  }

  @MessagePattern('changeMenuItemPosition')
  changePosition(
    @Payload() changeMenuItemPositionDto: ChangeMenuItemPositionDto,
  ): Promise<MenuItem> {
    this.logger.log('Received changeMenuItemPosition request');
    return this.menuItemService.changePosition(changeMenuItemPositionDto);
  }

  @MessagePattern('removeMenuItem')
  remove(@Payload() id: string): Promise<StatusResponseDto> {
    this.logger.log('Received removeMenuItem request');
    return this.menuItemService.remove(id);
  }
}
