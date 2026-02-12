import { IsNotEmpty, IsString, IsOptional, IsIn } from 'class-validator';

export class ConfirmPreviewDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;
}

export class CancelPreviewDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;
}

export class RemovePreviewItemDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;
}

export class ResolveAmbiguousDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  ingredient_id: string;
}

export class AddCustomItemDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  name_ua?: string;
}

export class ReplacePreviewItemDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  name_ua?: string;
}

export class ChangeAmountDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}

export class ResolveUnitConflictDto {
  @IsString()
  @IsNotEmpty()
  preview_id: string;

  @IsString()
  @IsNotEmpty()
  item_id: string;

  @IsString()
  @IsIn(['combine', 'separate'])
  resolution: 'combine' | 'separate';
}
