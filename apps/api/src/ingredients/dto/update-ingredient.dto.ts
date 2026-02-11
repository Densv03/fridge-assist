import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateIngredientDto {
  @IsString()
  @IsOptional()
  canonical_name?: string;

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
