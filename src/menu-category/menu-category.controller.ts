import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { LanguageCode } from '../database/db.enums';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategory } from './entities/menu-category.entity';
import {
  ChangeMenuCategoryPositionRequest,
  CreateMenuCategoryRequest,
  MENU_CATEGORY_SERVICE_NAME,
  MenuCategoryServiceControllerMethods,
  StatusResponse,
  UpdateMenuCategoryRequest,
} from './menu-category.pb';

@MenuCategoryServiceControllerMethods()
@Controller()
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}
  protected readonly logger = new Logger(MenuCategoryController.name);

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetMenuCategoriesByLanguage')
  async getMenuCategoriesByLanguage({
    language,
  }: {
    language: LanguageCode;
  }): Promise<{ menuCategories: MenuCategory[] }> {
    this.logger.log('Received findMenuCategoryByLanguage request');
    const menuCategories =
      await this.menuCategoryService.findByLanguage(language);
    return { menuCategories };
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetAllMenuCategories')
  async getAllMenuCategories() {
    this.logger.log('Received findAllMenuCategory request');
    const menuCategories = await this.menuCategoryService.findAll();
    return { menuCategories };
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetMenuCategoryById')
  getMenuCategoryById({ id }: { id: string }): Promise<MenuCategory> {
    this.logger.log('Received findMenuCategoryById request');
    return this.menuCategoryService.findById(id);
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'CreateMenuCategory')
  createMenuCategory(
    createMenuCategoryDto: CreateMenuCategoryRequest,
  ): Promise<MenuCategory> {
    this.logger.log('Received createMenuCategory request');
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'UpdateMenuCategory')
  updateMenuCategory(
    updateMenuCategoryDto: UpdateMenuCategoryRequest,
  ): Promise<MenuCategory> {
    this.logger.log('Received updateMenuCategory request');
    return this.menuCategoryService.update(updateMenuCategoryDto);
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'ChangeMenuCategoryPosition')
  changeMenuCategoryPosition(
    changeMenuCategoryPositionDto: ChangeMenuCategoryPositionRequest,
  ): Promise<MenuCategory> {
    this.logger.log('Received changeMenuCategoryPosition request');
    return this.menuCategoryService.changePosition(
      changeMenuCategoryPositionDto,
    );
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'DeleteMenuCategory')
  deleteMenuCategory({ id }: { id: string }): Promise<StatusResponse> {
    this.logger.log('Received removeMenuCategory request');
    return this.menuCategoryService.remove(id);
  }
}
