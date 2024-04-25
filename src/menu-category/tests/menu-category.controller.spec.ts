import { Test, TestingModule } from '@nestjs/testing';

import { MenuCategoryController } from '../menu-category.controller';
import { MenuCategoryService } from '../menu-category.service';
import { LanguageCode } from '../../database/db.enums';
import { MenuCategory } from '../entities/menu-category.entity';
import { ChangeMenuCategoryPositionDto } from '../dto/change-menu-category-position.dto';
import { CreateMenuCategoryDto } from '../dto/create-menu-category.dto';

const mockMenuCategory: MenuCategory = {
  id: '48670bd2-6392-42b6-9ef1-1d5867a175cf',
  createdAt: new Date(),
  updatedAt: new Date(),
  language: LanguageCode.UA,
  title: 'Test title',
  description: 'Test description',
  image: 'Test image url',
  hidden: false,
  position: 1,
  menuItems: [],
};

const mockMenuCategoryService = {
  findByLanguage: jest.fn((language: LanguageCode) => {
    return [{ language, ...mockMenuCategory }];
  }),
  findAll: jest.fn(() => {
    return [mockMenuCategory];
  }),
  findById: jest.fn((id: string) => {
    return { id, ...mockMenuCategory };
  }),
  create: jest.fn((dto: CreateMenuCategoryDto) => {
    return { id: 'new-id', ...dto };
  }),
  update: jest.fn((id: string, dto: MenuCategory) => {
    return { id, ...dto };
  }),
  changePosition: jest.fn((dto: ChangeMenuCategoryPositionDto) => {
    return {
      ...mockMenuCategory,
      position: dto.newPosition,
      id: dto.menuCategoryId,
    };
  }),
  remove: jest.fn(() => {
    return { status: true };
  }),
};

describe('MenuCategoryController', () => {
  let controller: MenuCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MenuCategoryController],
      providers: [MenuCategoryService],
    })
      .overrideProvider(MenuCategoryService)
      .useValue(mockMenuCategoryService)
      .compile();

    controller = module.get<MenuCategoryController>(MenuCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
