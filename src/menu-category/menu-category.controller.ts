import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { StatusResponseDto } from '../types/status-response';
import { LanguageCode as LanguageCodeDB } from '../database/db.enums';
import { MenuCategoryService } from './menu-category.service';
import {
  ChangeMenuCategoryPositionDto,
  CreateMenuCategoryDto,
  UpdateMenuCategoryDto,
} from './dto/_index';
import { MenuCategory } from './entities/menu-category.entity';
import {
  LanguageCode,
  MENU_CATEGORY_SERVICE_NAME,
  MenuCategoryServiceControllerMethods,
} from './menu-category.pb';

@MenuCategoryServiceControllerMethods()
@Controller()
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}
  protected readonly logger = new Logger(MenuCategoryController.name);

  // @MessagePattern('findMenuCategoriesByLanguage')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetMenuCategoriesByLanguage')
  async getMenuCategoriesByLanguage({
    language,
  }: {
    language: LanguageCode;
  }): Promise<{ menuCategories: MenuCategory[] }> {
    this.logger.log('Received findMenuCategoryByLanguage request');
    const menuCategories = await this.menuCategoryService.findByLanguage(
      LanguageCode[language] as LanguageCodeDB,
    );
    return { menuCategories };
  }

  // @MessagePattern('findAllMenuCategories')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetAllMenuCategories')
  async getAllMenuCategories() {
    this.logger.log('Received findAllMenuCategory request');
    const menuCategories = await this.menuCategoryService.findAll();
    return { menuCategories };
  }

  // @MessagePattern('findMenuCategoryById')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetMenuCategoryById')
  getMenuCategoryById({ id }: { id: string }): Promise<MenuCategory> {
    this.logger.log('Received findMenuCategoryById request');
    return this.menuCategoryService.findById(id);
  }

  // @MessagePattern('createMenuCategory')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'CreateMenuCategory')
  createMenuCategory(
    createMenuCategoryDto: CreateMenuCategoryDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received createMenuCategory request');
    return this.menuCategoryService.create({
      ...createMenuCategoryDto,
      language: LanguageCode[
        createMenuCategoryDto.language
      ] as unknown as LanguageCodeDB,
    });
  }

  // @MessagePattern('updateMenuCategory')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'UpdateMenuCategory')
  updateMenuCategory(
    updateMenuCategoryDto: UpdateMenuCategoryDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received updateMenuCategory request');
    return this.menuCategoryService.update(updateMenuCategoryDto);
  }

  // @MessagePattern('changeMenuCategoryPosition')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'ChangeMenuCategoryPosition')
  changeMenuCategoryPosition(
    changeMenuCategoryPositionDto: ChangeMenuCategoryPositionDto,
  ): Promise<MenuCategory> {
    this.logger.log('Received changeMenuCategoryPosition request');
    return this.menuCategoryService.changePosition(
      changeMenuCategoryPositionDto,
    );
  }

  // @MessagePattern('removeMenuCategory')
  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'DeleteMenuCategory')
  deleteMenuCategory({ id }: { id: string }): Promise<StatusResponseDto> {
    this.logger.log('Received removeMenuCategory request');
    return this.menuCategoryService.remove(id);
  }
}
