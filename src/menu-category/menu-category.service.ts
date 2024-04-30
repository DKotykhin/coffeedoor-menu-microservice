import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { LanguageCode } from '../database/db.enums';
import { ErrorImplementation } from '../utils/error-implementation';
import { MenuCategory } from './entities/menu-category.entity';
import {
  ChangeMenuCategoryPositionRequest,
  CreateMenuCategoryRequest,
  StatusResponse,
  UpdateMenuCategoryRequest,
} from './menu-category.pb';

@Injectable()
export class MenuCategoryService {
  constructor(
    @InjectRepository(MenuCategory)
    private readonly menuCategoryRepository: Repository<MenuCategory>,
    private readonly entityManager: EntityManager,
  ) {}
  protected readonly logger = new Logger(MenuCategoryService.name);

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
      this.logger.error(error?.message);
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
      this.logger.error(error?.message);
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
      this.logger.error(error?.message);
      throw ErrorImplementation.notFound('Menu category not found');
    }
  }

  async create(
    createMenuCategoryDto: CreateMenuCategoryRequest,
  ): Promise<MenuCategory> {
    const menuCategory = new MenuCategory({
      ...createMenuCategoryDto,
      language: createMenuCategoryDto.language as LanguageCode,
    });
    try {
      return await this.entityManager.save('MenuCategory', menuCategory);
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
      Object.assign(menuCategory, updateMenuCategoryDto);
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden("Couldn't update menu category");
    }
  }

  async changePosition(
    changeMenuCategoryPosition: ChangeMenuCategoryPositionRequest,
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
      this.logger.error(error?.message);
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
      this.logger.error(error?.message);
      throw ErrorImplementation.forbidden("Couldn't delete menu category");
    }
  }
}
