/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "menuCategory";

export enum LanguageCode {
  UA = 0,
  EN = 1,
  UNRECOGNIZED = -1,
}

export interface Empty {
}

export interface MenuCategory {
  id: string;
  language: LanguageCode;
  title: string;
  description: string;
  image: string;
  hidden: boolean;
  position: number;
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  language: LanguageCode;
  title: string;
  description: string;
  price: string;
  hidden: boolean;
  position: number;
  category: string;
}

export interface MenuCategories {
  menuCategories: MenuCategory[];
}

export interface MenuCategoryLanguage {
  language: LanguageCode;
}

export interface MenuCategoryId {
  id: string;
}

export interface CreateMenuCategoryRequest {
  language: LanguageCode;
  title: string;
  description: string;
  image: string;
  hidden: boolean;
  position: number;
}

export interface UpdateMenuCategoryRequest {
  id: string;
  title?: string | undefined;
  description?: string | undefined;
  image?: string | undefined;
  hidden?: boolean | undefined;
  position?: number | undefined;
}

export interface ChangeMenuCategoryPositionRequest {
  menuCategoryId: string;
  oldPosition: number;
  newPosition: number;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export const MENU_CATEGORY_PACKAGE_NAME = "menuCategory";

export interface MenuCategoryServiceClient {
  getMenuCategoriesByLanguage(request: MenuCategoryLanguage): Observable<MenuCategories>;

  getAllMenuCategories(request: Empty): Observable<MenuCategories>;

  getMenuCategoryById(request: MenuCategoryId): Observable<MenuCategory>;

  createMenuCategory(request: CreateMenuCategoryRequest): Observable<MenuCategory>;

  updateMenuCategory(request: UpdateMenuCategoryRequest): Observable<MenuCategory>;

  changeMenuCategoryPosition(request: ChangeMenuCategoryPositionRequest): Observable<MenuCategory>;

  deleteMenuCategory(request: MenuCategoryId): Observable<StatusResponse>;
}

export interface MenuCategoryServiceController {
  getMenuCategoriesByLanguage(
    request: MenuCategoryLanguage,
  ): Promise<MenuCategories> | Observable<MenuCategories> | MenuCategories;

  getAllMenuCategories(request: Empty): Promise<MenuCategories> | Observable<MenuCategories> | MenuCategories;

  getMenuCategoryById(request: MenuCategoryId): Promise<MenuCategory> | Observable<MenuCategory> | MenuCategory;

  createMenuCategory(
    request: CreateMenuCategoryRequest,
  ): Promise<MenuCategory> | Observable<MenuCategory> | MenuCategory;

  updateMenuCategory(
    request: UpdateMenuCategoryRequest,
  ): Promise<MenuCategory> | Observable<MenuCategory> | MenuCategory;

  changeMenuCategoryPosition(
    request: ChangeMenuCategoryPositionRequest,
  ): Promise<MenuCategory> | Observable<MenuCategory> | MenuCategory;

  deleteMenuCategory(request: MenuCategoryId): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function MenuCategoryServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getMenuCategoriesByLanguage",
      "getAllMenuCategories",
      "getMenuCategoryById",
      "createMenuCategory",
      "updateMenuCategory",
      "changeMenuCategoryPosition",
      "deleteMenuCategory",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MenuCategoryService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MenuCategoryService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MENU_CATEGORY_SERVICE_NAME = "MenuCategoryService";
