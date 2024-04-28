import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import {
  ChangeMenuCategoryPositionDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
} from './dto/_index';
import { MenuCategory } from './entities/menu-category.entity';
import { StatusResponse } from './menu-category.pb';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    private readonly entityManager: EntityManager,
  ) {}

  async findByLanguage(language: LanguageCode): Promise<MenuCategory[]> {
    try {
      return await this.menuCategoryRepository.find({
        where: {
          language,
          hidden: false,
        },
        relations: ['menuItems'],
        order: {
          position: 'ASC',
          menuItems: {
            position: 'ASC',
          },
        },
      });
    } catch (error) {
      throw ErrorImplementation.forbidden(error.message);
    }
  }

  async findAll(): Promise<MenuCategory[]> {
    try {
      return await this.menuCategoryRepository.find({
        relations: ['menuItems'],
        order: {
          position: 'ASC',
          menuItems: {
            position: 'ASC',
          },
        },
      });
    } catch (error) {
      throw ErrorImplementation.forbidden(error.message);
    }
  }

  async findById(id: string): Promise<MenuCategory> {
    // return await this.entityManager.findOne('MenuCategory', { where: { id } });
    try {
      return await this.menuCategoryRepository.findOne({
        where: { id },
        relations: ['menuItems'],
      });
    } catch (error) {
      throw ErrorImplementation.notFound('Menu category not found');
    }
  }

  async create(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const menuCategory = new MenuCategory(createMenuCategoryDto);
    try {
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      throw ErrorImplementation.forbidden("Couldn't create menu category");
    }
  }

  async update(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    try {
      const menuCategory = await this.findById(updateMenuCategoryDto.id);
      Object.assign(menuCategory, updateMenuCategoryDto);
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      throw ErrorImplementation.forbidden("Couldn't update menu category");
    }
  }

  async changePosition(
    changeMenuCategoryPosition: ChangeMenuCategoryPositionDto,
  ): Promise<MenuCategory> {
    try {
      const { menuCategoryId, oldPosition, newPosition } =
        changeMenuCategoryPosition;
      const menuCategory = await this.menuCategoryRepository.findOneOrFail({
        where: { id: menuCategoryId },
      });
      const updatedMenuCategory = await this.menuCategoryRepository.save({
        ...menuCategory,
        position: newPosition,
      });
      await this.menuCategoryRepository
        .createQueryBuilder()
        .update(MenuCategory)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id: menuCategoryId })
        .andWhere('language = :language', { language: menuCategory.language })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();
      return updatedMenuCategory;
    } catch (error) {
      throw ErrorImplementation.forbidden(
        "Couldn't change menu category position",
      );
    }
  }

  async remove(id: string): Promise<StatusResponse> {
    try {
      const result = await this.menuCategoryRepository.delete(id);
      if (result.affected === 0) {
        throw ErrorImplementation.notFound('Menu category not found');
      }
      return {
        status: true,
        message: `Menu category ${id} successfully deleted`,
      };
    } catch (error) {
      throw ErrorImplementation.forbidden("Couldn't delete menu category");
    }
  }
}
