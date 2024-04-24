import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MenuCategoryService } from './menu-category.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { UpdateMenuCategoryDto } from './dto/update-menu-category.dto';

@Controller()
export class MenuCategoryController {
  constructor(private readonly menuCategoryService: MenuCategoryService) {}

  @MessagePattern('createMenuCategory')
  create(@Payload() createMenuCategoryDto: CreateMenuCategoryDto) {
    return this.menuCategoryService.create(createMenuCategoryDto);
  }

  @MessagePattern('findAllMenuCategory')
  findAll() {
    return this.menuCategoryService.findAll();
  }

  @MessagePattern('findOneMenuCategory')
  findOne(@Payload() id: number) {
    return this.menuCategoryService.findOne(id);
  }

  @MessagePattern('updateMenuCategory')
  update(@Payload() updateMenuCategoryDto: UpdateMenuCategoryDto) {
    return this.menuCategoryService.update(
      updateMenuCategoryDto.id,
      updateMenuCategoryDto,
    );
  }

  @MessagePattern('removeMenuCategory')
  remove(@Payload() id: number) {
    return this.menuCategoryService.remove(id);
  }
}
