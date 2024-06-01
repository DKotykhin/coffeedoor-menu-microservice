import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import { MenuItem as MenuItemEntity } from './entities/menu-item.entity';
import {
  ChangeMenuItemPositionRequest,
  CreateMenuItemRequest,
  MenuItem,
  MenuItemList,
  StatusResponse,
  UpdateMenuItemRequest,
} from './menu-item.pb';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItemEntity)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(MenuItemService.name);

  async getMenuItemsByCategoryId(id: string): Promise<MenuItemList> {
    try {
      const menuItemList = await this.menuItemRepository.find({
        where: { menuCategory: { id } },
        order: {
          position: 'ASC',
        },
      });
      return { menuItemList };
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.notFound('Menu items not found');
    }
  }

  async findById(id: string): Promise<MenuItem> {
    try {
      const menuItem = await this.menuItemRepository.findOne({
        where: { id },
        relations: ['menuCategory'],
      });
      if (!menuItem) {
        throw ErrorImplementation.notFound('Menu item not found');
      }
      return menuItem;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async create(createMenuItemDto: CreateMenuItemRequest): Promise<MenuItem> {
    try {
      return await this.entityManager.save(MenuItemEntity, {
        ...createMenuItemDto,
        language: createMenuItemDto.language as LanguageCode,
      });
    } catch (error) {
      this.logger.error(error.message);
      throw ErrorImplementation.forbidden('Menu item not created');
    }
  }

  async update(updateMenuItemDto: UpdateMenuItemRequest): Promise<MenuItem> {
    try {
      const menuItemToUpdate = await this.menuItemRepository.findOne({
        where: { id: updateMenuItemDto.id },
      });
      if (!menuItemToUpdate) {
        throw ErrorImplementation.notFound('Menu item not found');
      }
      Object.assign(menuItemToUpdate, updateMenuItemDto);
      return await this.entityManager.save('MenuItem', menuItemToUpdate);
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async changePosition(
    changeMenuItemPosition: ChangeMenuItemPositionRequest,
  ): Promise<MenuItem> {
    try {
      const { id, oldPosition, newPosition } = changeMenuItemPosition;
      const menuItem = await this.menuItemRepository.findOne({
        where: { id },
        relations: ['menuCategory'],
      });
      if (!menuItem) {
        throw ErrorImplementation.notFound('Menu item not found');
      }
      const updatedMenuItem = await this.menuItemRepository.save({
        ...menuItem,
        position: newPosition,
      });

      const { language, menuCategory } = menuItem;
      await this.menuItemRepository
        .createQueryBuilder()
        .update(MenuItemEntity)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id })
        .andWhere('language = :language', { language })
        .andWhere('menuCategoryId = :menuCategoryId', {
          menuCategoryId: menuCategory.id,
        })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();

      return updatedMenuItem;
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.menuItemRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Menu item not found');
      }
      return {
        status: true,
        message: `Menu item ${id} successfully deleted`,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw new ErrorImplementation({
        message: error.message,
        code: error.error?.code || 13,
      });
    }
  }
}
