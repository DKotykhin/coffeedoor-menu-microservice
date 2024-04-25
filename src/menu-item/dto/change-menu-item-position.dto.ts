import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class ChangeMenuItemPositionDto {
  @IsNotEmpty()
  @IsUUID()
  menuItemId: string;

  @IsNotEmpty()
  @IsNumber()
  oldPosition: number;

  @IsNotEmpty()
  @IsNumber()
  newPosition: number;
}
