import { ApiClient } from '../api-client/api-client';
import { getRecipeSuggestions } from '../api-client/recipes.api';
import { ExtractionPreview } from '../api-client/types';
import { cacheSuggestions } from '../handlers/cook.handler';
import {
  formatRecipeSuggestions,
  buildDishKeyboard,
} from '../formatters/cook.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { showLoading } from './loading';

export async function handleCookIntent(
  ctx: BotContext & { lang: 'ua' | 'en'; internalUserId?: string },
  api: ApiClient,
  preview: ExtractionPreview,
): Promise<void> {
  const ingredients = preview.items.map((item) =>
    ctx.lang === 'ua' && item.canonical_name_ua
      ? item.canonical_name_ua
      : item.canonical_name,
  );

  const ingredientNamesEn = preview.items.map((item) => item.canonical_name);

  const hideLoading = await showLoading(ctx);
  try {
    const data = await getRecipeSuggestions(api, ctx.internalUserId!, {
      ingredients: ingredientNamesEn.length > 0 ? ingredientNamesEn : undefined,
    });
    await hideLoading();

    if (data.empty_fridge && ingredientNamesEn.length === 0) {
      await ctx.reply(t(ctx.lang, 'cook_empty_fridge'), {
        parse_mode: 'HTML',
      });
      return;
    }

    const { cacheId, dishIdMap } = cacheSuggestions(
      data,
      ctx.internalUserId!,
      undefined,
      undefined,
      ingredientNamesEn.length > 0 ? ingredientNamesEn : undefined,
    );

    let message: string;
    if (ingredients.length > 0) {
      const title = t(ctx.lang, 'cook_with_title').replace(
        '{ingredients}',
        ingredients.join(', '),
      );
      const body = formatRecipeSuggestions(data, ctx.lang);
      message = title + '\n' + body;
    } else {
      message = formatRecipeSuggestions(data, ctx.lang);
    }

    const keyboard = buildDishKeyboard(data, cacheId, dishIdMap, ctx.lang);

    await ctx.reply(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  } catch (err) {
    await hideLoading();
    throw err;
  }
}
