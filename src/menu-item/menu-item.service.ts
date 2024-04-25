import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { StatusResponseDto } from '../types/status-response';
import {
  ChangeMenuItemPositionDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/_index';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepository: Repository<MenuItem>,
    private readonly entityManager: EntityManager,
  ) {}

  async findAllByCategoryId(categoryId: string): Promise<MenuItem[]> {
    try {
      return await this.menuItemRepository.find({
        where: { category: { id: categoryId } },
        order: {
          position: 'ASC',
        },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async findById(id: string): Promise<MenuItem> {
    try {
      return await this.menuItemRepository.findOne({
        where: { id },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(createMenuItemDto: CreateMenuItemDto): Promise<MenuItem> {
    try {
      return await this.entityManager.save(MenuItem, {
        ...createMenuItemDto,
        category: { id: createMenuItemDto.categoryId },
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  async update(updateMenuItemDto: UpdateMenuItemDto): Promise<MenuItem> {
    try {
      return await this.entityManager.save(MenuItem, {
        ...updateMenuItemDto,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async changePosition(
    changeMenuItemPosition: ChangeMenuItemPositionDto,
  ): Promise<MenuItem> {
    try {
      const { menuItemId, oldPosition, newPosition } = changeMenuItemPosition;
      const menuItem = await this.menuItemRepository.findOneOrFail({
        where: { id: menuItemId },
        relations: ['category'],
      });
      const updatedMenuItem = await this.menuItemRepository.save({
        ...menuItem,
        position: newPosition,
      });

      const { language, category } = menuItem;
      await this.menuItemRepository
        .createQueryBuilder()
        .update(MenuItem)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id: menuItemId })
        .andWhere('language = :language', { language })
        .andWhere('categoryId = :categoryId', { categoryId: category.id })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();

      return updatedMenuItem;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string): Promise<StatusResponseDto> {
    try {
      const result = await this.menuItemRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: `Menu item ${id} successfully deleted`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
