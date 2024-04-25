import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { LanguageCode } from '../../database/db.enums';

export class CreateMenuItemDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  position: number;

  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
