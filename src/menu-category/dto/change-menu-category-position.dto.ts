import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ChangeMenuCategoryPositionDto {
  @IsNotEmpty()
  @IsUUID()
  menuCategoryId: string;

  @IsNotEmpty()
  @IsNumber()
  oldPosition: number;

  @IsNotEmpty()
  @IsNumber()
  newPosition: number;
}
