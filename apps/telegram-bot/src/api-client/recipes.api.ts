import { ApiClient } from './api-client';
import { ConsumeResult, RecipeDetail, RecipeSuggestionsResponse } from './types';

export async function getRecipeSuggestions(
  api: ApiClient,
  userId: string,
  options?: { exclude?: string[]; mode?: 'more' | 'creative'; categories?: string[] },
): Promise<RecipeSuggestionsResponse> {
  const params: Record<string, string> = {};
  if (options?.exclude?.length) {
    params.exclude = options.exclude.join(',');
  }
  if (options?.mode) {
    params.mode = options.mode;
  }
  if (options?.categories?.length) {
    params.categories = options.categories.join(',');
  }

  const { data } = await api.get<RecipeSuggestionsResponse>(
    '/recipes/suggestions',
    {
      headers: { 'x-user-id': userId },
      params,
    },
  );
  return data;
}

export async function getRecipeDetail(
  api: ApiClient,
  userId: string,
  dishNameEn: string,
  dishNameUa: string,
): Promise<RecipeDetail> {
  const { data } = await api.post<RecipeDetail>(
    '/recipes/detail',
    { dish_name_en: dishNameEn, dish_name_ua: dishNameUa },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function consumeRecipe(
  api: ApiClient,
  userId: string,
  ingredients: Array<{ name_en: string; quantity_num: number; unit: string }>,
  dishInfo?: { dish_name_en: string; dish_name_ua: string; category?: string },
): Promise<ConsumeResult> {
  const { data } = await api.post<ConsumeResult>(
    '/recipes/consume',
    { ingredients, dish_info: dishInfo },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}
