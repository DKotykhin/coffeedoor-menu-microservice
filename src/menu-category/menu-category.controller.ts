import { Controller, Logger } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { LanguageCode } from '../database/db.enums';
import { MenuCategoryService } from './menu-category.service';
import { MenuCategory } from './entities/menu-category.entity';
import {
  ChangeMenuCategoryPositionRequest,
  CreateMenuCategoryRequest,
  MENU_CATEGORY_SERVICE_NAME,
  MenuCategoryList,
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
  }): Promise<MenuCategoryList> {
    this.logger.log('Received getMenuCategoriesByLanguage request');
    return await this.menuCategoryService.findByLanguage(language);
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetAllMenuCategories')
  async getAllMenuCategories(): Promise<MenuCategoryList> {
    this.logger.log('Received getAllMenuCategories request');
    return await this.menuCategoryService.findAll();
  }

  @GrpcMethod(MENU_CATEGORY_SERVICE_NAME, 'GetMenuCategoryById')
  getMenuCategoryById({ id }: { id: string }): Promise<MenuCategory> {
    this.logger.log('Received getMenuCategoryById request');
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
