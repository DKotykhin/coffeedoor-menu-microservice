import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { LanguageCode } from '../../database/db.enums';

export class CreateMenuCategoryDto {
  @IsEnum(LanguageCode)
  language: LanguageCode;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsBoolean()
  hidden: boolean;

  @IsNumber()
  position: number;
}
