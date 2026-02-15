import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { UserId } from '../common/pipes/parse-user-id.pipe';
import { UserExistsGuard } from '../common/guards/user-exists.guard';

@Controller('recipes')
@UseGuards(UserExistsGuard)
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('suggestions')
  getSuggestions(
    @UserId() userId: string,
    @Query('exclude') exclude?: string,
    @Query('mode') mode?: string,
    @Query('categories') categories?: string,
    @Query('ingredients') ingredients?: string,
  ) {
    const options: { exclude?: string[]; mode?: 'more' | 'creative'; categories?: string[]; ingredients?: string[] } = {};
    if (exclude) {
      options.exclude = exclude.split(',').map((s) => s.trim());
    }
    if (mode === 'creative') {
      options.mode = 'creative';
    }
    if (categories) {
      options.categories = categories.split(',').map((s) => s.trim());
    }
    if (ingredients) {
      options.ingredients = ingredients.split(',').map((s) => s.trim());
    }
    return this.recipesService.getSuggestions(userId, options);
  }

  @Post('detail')
  getRecipeDetail(
    @UserId() userId: string,
    @Body() body: { dish_name_en: string; dish_name_ua: string },
  ) {
    return this.recipesService.getRecipeDetail(
      userId,
      body.dish_name_en,
      body.dish_name_ua,
    );
  }

  @Post('consume')
  consumeRecipe(
    @UserId() userId: string,
    @Body()
    body: {
      ingredients: Array<{
        name_en: string;
        quantity_num: number;
        unit: string;
      }>;
      dish_info?: {
        dish_name_en: string;
        dish_name_ua: string;
        category?: string;
      };
    },
  ) {
    return this.recipesService.consumeRecipe(
      userId,
      body.ingredients,
      body.dish_info,
    );
  }
}
