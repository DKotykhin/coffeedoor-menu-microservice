/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "menuItem";

export enum LanguageCode {
  UA = 0,
  EN = 1,
  UNRECOGNIZED = -1,
}

export interface MenuItem {
  id: string;
  language: LanguageCode;
  title: string;
  description: string;
  price: string;
  hidden: boolean;
  position: number;
  category: Id | undefined;
}

export interface MenuItems {
  items: MenuItem[];
}

export interface MenuCategoryId {
  categoryId: string;
}

export interface Id {
  id: string;
}

export interface CreateMenuItemRequest {
  language: LanguageCode;
  title: string;
  description: string;
  price: string;
  hidden: boolean;
  position: number;
  categoryId: string;
}

export interface UpdateMenuItemRequest {
  id: string;
  title?: string | undefined;
  description?: string | undefined;
  price?: string | undefined;
  hidden?: boolean | undefined;
  position?: number | undefined;
}

export interface ChangeMenuItemPositionRequest {
  menuItemId: string;
  oldPosition: number;
  newPosition: number;
}

export interface StatusResponse {
  status: boolean;
  message: string;
}

export const MENU_ITEM_PACKAGE_NAME = "menuItem";

export interface MenuItemServiceClient {
  getMenuItemsByCategoryId(request: MenuCategoryId): Observable<MenuItems>;

  getMenuItemById(request: Id): Observable<MenuItem>;

  createMenuItem(request: CreateMenuItemRequest): Observable<MenuItem>;

  updateMenuItem(request: UpdateMenuItemRequest): Observable<MenuItem>;

  changeMenuItemPosition(request: ChangeMenuItemPositionRequest): Observable<MenuItem>;

  deleteMenuItem(request: Id): Observable<StatusResponse>;
}

export interface MenuItemServiceController {
  getMenuItemsByCategoryId(request: MenuCategoryId): Promise<MenuItems> | Observable<MenuItems> | MenuItems;

  getMenuItemById(request: Id): Promise<MenuItem> | Observable<MenuItem> | MenuItem;

  createMenuItem(request: CreateMenuItemRequest): Promise<MenuItem> | Observable<MenuItem> | MenuItem;

  updateMenuItem(request: UpdateMenuItemRequest): Promise<MenuItem> | Observable<MenuItem> | MenuItem;

  changeMenuItemPosition(request: ChangeMenuItemPositionRequest): Promise<MenuItem> | Observable<MenuItem> | MenuItem;

  deleteMenuItem(request: Id): Promise<StatusResponse> | Observable<StatusResponse> | StatusResponse;
}

export function MenuItemServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      "getMenuItemsByCategoryId",
      "getMenuItemById",
      "createMenuItem",
      "updateMenuItem",
      "changeMenuItemPosition",
      "deleteMenuItem",
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("MenuItemService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("MenuItemService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const MENU_ITEM_SERVICE_NAME = "MenuItemService";
