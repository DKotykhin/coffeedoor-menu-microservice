import { Test, TestingModule } from '@nestjs/testing';
import { EntityManager } from 'typeorm';

import { LanguageCode } from '../../database/db.enums';
import { MenuCategoryService } from '../menu-category.service';
import { MenuCategory } from '../entities/menu-category.entity';

const mockMenuCategoryItem: Partial<MenuCategory> = {
  id: '1',
  title: 'Test Menu Category',
  description: 'Test Description',
  language: LanguageCode.EN,
  position: 1,
  hidden: false,
  menuItems: [],
};

const mockMenuCategoryRepository = () => ({
  find: jest.fn(() => []),
  findOne: jest.fn((id) => ({ id, ...mockMenuCategoryItem })),
  findOneOrFail: jest.fn((id) => ({ id, ...mockMenuCategoryItem })),
  findById: jest.fn((id) => ({ id, ...mockMenuCategoryItem })),
  save: jest.fn((_, item) => item),
  delete: jest.fn((id: string) => id),
});

describe('MenuCategoryService', () => {
  let service: MenuCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuCategoryService,
        {
          provide: 'MenuCategoryRepository',
          useFactory: mockMenuCategoryRepository,
        },
        {
          provide: EntityManager,
          useFactory: mockMenuCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<MenuCategoryService>(MenuCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
