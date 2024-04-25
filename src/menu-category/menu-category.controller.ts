import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { LanguageCode } from '../database/db.enums';
import { MenuCategoryService } from './menu-category.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';
import { ChangeMenuCategoryPositionDto } from './dto/change-menu-category-position.dto';

@Controller()
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}
  protected readonly logger = new Logger(MenuCategoryController.name);

  @MessagePattern('findMenuCategoryByLanguage')
  findByLanguage(@Payload() language: LanguageCode) {
    this.logger.log('Received findMenuCategoryByLanguage request');
    return this.menuCategoryService.findByLanguage(language);
  }

  @MessagePattern('findAllMenuCategory')
  findAll() {
    this.logger.log('Received findAllMenuCategory request');
    return this.menuCategoryService.findAll();
  }

  @MessagePattern('findMenuCategoryById')
  findById(@Payload() id: string) {
    this.logger.log('Received findMenuCategoryById request');
    return this.menuCategoryService.findById(id);
  }

  @MessagePattern('createMenuCategory')
  create(@Payload() createMenuCategoryDto: CreateMenuCategoryDto) {
    this.logger.log('Received createMenuCategory request');
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @MessagePattern('updateMenuCategory')
  update(@Payload() updateMenuCategoryDto: UpdateMenuCategoryDto) {
    this.logger.log('Received updateMenuCategory request');
    return this.menuCategoryService.update(updateMenuCategoryDto);
  }

  @MessagePattern('changeMenuCategoryPosition')
  changePosition(
    @Payload() changeMenuCategoryPositionDto: ChangeMenuCategoryPositionDto,
  ) {
    this.logger.log('Received changeMenuCategoryPosition request');
    return this.menuCategoryService.changePosition(
      changeMenuCategoryPositionDto,
    );
  }

  @MessagePattern('removeMenuCategory')
  remove(@Payload() id: string) {
    this.logger.log('Received removeMenuCategory request');
    return this.menuCategoryService.remove(id);
  }
}
