import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  @IsNotEmpty()
  canonical_name: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  default_unit?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  aliases?: string[];
}
