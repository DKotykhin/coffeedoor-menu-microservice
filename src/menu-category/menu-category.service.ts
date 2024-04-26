import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { StatusResponseDto } from '../types/status-response';
import { LanguageCode } from '../database/db.enums';
import {
  ChangeMenuCategoryPositionDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
} from './dto/_index';
import { MenuCategory } from './entities/menu-category.entity';

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
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async findAll(): Promise<MenuCategory[]> {
    try {
      return await this.menuCategoryRepository.find({
        relations: ['menuItems'],
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async create(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    const menuCategory = new MenuCategory(createMenuCategoryDto);
    try {
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.FORBIDDEN);
    }
  }

  async update(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    // return await this.menuCategoryRepository.update(id, updateMenuCategoryDto);
    try {
      const menuCategory = await this.findById(updateMenuCategoryDto.id);
      Object.assign(menuCategory, updateMenuCategoryDto);
      return await this.entityManager.save('MenuCategory', menuCategory);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }

  async remove(id: string): Promise<StatusResponseDto> {
    try {
      const result = await this.menuCategoryRepository.delete(id);
      if (result.affected === 0) {
        throw new HttpException('Not found', HttpStatus.NOT_FOUND);
      }
      return {
        status: true,
        message: `Menu category ${id} successfully deleted`,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
    }
  }
}
