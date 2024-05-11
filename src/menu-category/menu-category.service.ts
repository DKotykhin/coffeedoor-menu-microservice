import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import { MenuCategory as MenuCategoryEntity } from './entities/menu-category.entity';
import {
  ChangeMenuCategoryPositionRequest,
  CreateMenuCategoryRequest,
  MenuCategory,
  MenuCategoryList,
  StatusResponse,
  UpdateMenuCategoryRequest,
} from './menu-category.pb';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategoryEntity)
    private readonly menuCategoryRepository: Repository<MenuCategoryEntity>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(MenuCategoryService.name);

  async findByLanguage(language: LanguageCode): Promise<MenuCategoryList> {
    try {
      const menuCategoryList = await this.menuCategoryRepository.find({
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
      return { menuCategoryList };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.notFound(error.message);
    }
  }

  async findAll(): Promise<MenuCategoryList> {
    try {
      const menuCategoryList = await this.menuCategoryRepository.find({
        relations: ['menuItems'],
        order: {
          position: 'ASC',
          menuItems: {
            position: 'ASC',
          },
        },
      });
      return { menuCategoryList };
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.notFound(error.message);
    }
  }

  async findById(id: string): Promise<MenuCategory> {
    try {
      const menuCategory = await this.menuCategoryRepository.findOne({
        where: { id },
        relations: ['menuItems'],
      });
      if (!menuCategory) {
        throw ErrorImplementation.notFound('Menu category not found');
      }
      return menuCategory;
    } catch (error) {
      this.logger.error(error?.message);
      throw new ErrorImplementation({
        message: error?.message,
        code: error.error?.code || 13,
      });
    }
  }

  async create(
    createMenuCategoryDto: CreateMenuCategoryRequest,
  ): Promise<MenuCategory> {
    try {
      return await this.entityManager.save(MenuCategoryEntity, {
        ...createMenuCategoryDto,
        language: createMenuCategoryDto.language as LanguageCode,
      });
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden("Couldn't create menu category");
    }
  }

  async update(
    updateMenuCategoryDto: UpdateMenuCategoryRequest,
  ): Promise<MenuCategory> {
    try {
      const menuCategory = await this.findById(updateMenuCategoryDto.id);
      if (!menuCategory) {
        throw ErrorImplementation.notFound('Menu category not found');
      }
      Object.assign(menuCategory, updateMenuCategoryDto);
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      this.logger.error(error?.message);
      throw new ErrorImplementation({
        message: error?.message,
        code: error.error?.code || 13,
      });
    }
  }

  async changePosition(
    changeMenuCategoryPosition: ChangeMenuCategoryPositionRequest,
  ): Promise<MenuCategory> {
    try {
      const { id, oldPosition, newPosition } = changeMenuCategoryPosition;
      const menuCategory = await this.menuCategoryRepository.findOne({
        where: { id },
      });
      if (!menuCategory) {
        throw ErrorImplementation.notFound('Menu category not found');
      }
      const updatedMenuCategory = await this.menuCategoryRepository.save({
        ...menuCategory,
        position: newPosition,
      });
      await this.menuCategoryRepository
        .createQueryBuilder()
        .update(MenuCategoryEntity)
        .set({
          position: () => `position ${oldPosition < newPosition ? '-' : '+'} 1`,
        })
        .where('id != :id', { id })
        .andWhere('language = :language', { language: menuCategory.language })
        .andWhere('position BETWEEN :minPosition AND :maxPosition', {
          minPosition: Math.min(oldPosition, newPosition),
          maxPosition: Math.max(oldPosition, newPosition),
        })
        .execute();
      return updatedMenuCategory;
    } catch (error) {
      this.logger.error(error?.message);
      throw new ErrorImplementation({
        message: error?.message,
        code: error.error?.code || 13,
      });
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
      this.logger.error(error?.message);
      throw new ErrorImplementation({
        message: error?.message,
        code: error.error?.code || 13,
      });
    }
  }
}
