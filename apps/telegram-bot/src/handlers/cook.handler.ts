import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import {
  getRecipeSuggestions,
  getRecipeDetail,
  consumeRecipe,
} from '../api-client/recipes.api';
import { RecipeSuggestionsResponse, RecipeDetail } from '../api-client/types';
import {
  formatRecipeSuggestions,
  buildDishKeyboard,
  buildRecipeDetailKeyboard,
  formatRecipeDetail,
  buildCategoryPickerKeyboard,
  selectedCategoriesToNames,
  ALL_CATEGORIES_MASK,
} from '../formatters/cook.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';
import { randomBytes } from 'crypto';
import { showLoading } from '../utils/loading';

// ── In-memory suggestion cache ──

interface CachedDish {
  dish_name_en: string;
  dish_name_ua: string;
  category?: string;
  detail?: RecipeDetail;
}

interface CachedSuggestions {
  userId: string;
  data: RecipeSuggestionsResponse;
  dishes: Map<string, CachedDish>; // shortDishId → dish names
  allShownDishNames: string[];
  previousCacheId?: string;
  categoryMask?: number;
  createdAt: number;
}

const suggestionCache = new Map<string, CachedSuggestions>();

const TTL_MS = 15 * 60 * 1000; // 15 minutes

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of suggestionCache) {
    if (now - entry.createdAt > TTL_MS) suggestionCache.delete(key);
  }
}, 5 * 60 * 1000);

function shortId(): string {
  return randomBytes(4).toString('hex');
}

function cacheSuggestions(
  data: RecipeSuggestionsResponse,
  userId: string,
  previouslyShown?: string[],
  previousCacheId?: string,
): { cacheId: string; dishIdMap: Map<string, string> } {
  const cacheId = shortId();
  const dishes = new Map<string, CachedDish>();
  const dishIdMap = new Map<string, string>();

  const allDishes = [...data.can_cook, ...data.need_to_buy];
  const currentNames = allDishes.map((d) => d.dish_name_en);

  for (const dish of allDishes) {
    const sid = shortId();
    dishes.set(sid, {
      dish_name_en: dish.dish_name_en,
      dish_name_ua: dish.dish_name_ua,
      category: dish.category,
    });
    dishIdMap.set(sid, dish.dish_name_en);
  }

  const allShownDishNames = [
    ...(previouslyShown ?? []),
    ...currentNames,
  ];

  suggestionCache.set(cacheId, {
    userId,
    data,
    dishes,
    allShownDishNames,
    previousCacheId,
    createdAt: Date.now(),
  });

  return { cacheId, dishIdMap };
}

export function registerCookHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  // ── /cook command ──
  bot.command('cook', async (ctx) => {
    if (!ctx.isRegistered) {
      const keyboard = new Keyboard()
        .requestContact(t(ctx.lang, 'share_phone_button'))
        .resized()
        .oneTime();
      await ctx.reply(t(ctx.lang, 'share_phone_prompt'), {
        reply_markup: keyboard,
      });
      return;
    }

    const hideLoading = await showLoading(ctx);
    try {
      const data = await getRecipeSuggestions(api, ctx.internalUserId!);
      await hideLoading();

      if (data.empty_fridge) {
        await ctx.reply(t(ctx.lang, 'cook_empty_fridge'), {
          parse_mode: 'HTML',
        });
        return;
      }

      const { cacheId, dishIdMap } = cacheSuggestions(data, ctx.internalUserId!);
      const message = formatRecipeSuggestions(data, ctx.lang);
      const keyboard = buildDishKeyboard(data, cacheId, dishIdMap, ctx.lang);

      await ctx.reply(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (err) {
      await hideLoading();
      logger.error('Failed to get recipe suggestions', err);
      await ctx.reply(t(ctx.lang, 'cook_error'));
    }
  });

  // ── Recipe detail callback ──
  bot.callbackQuery(/^rcp:([^:]+):(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const dishShortId = ctx.match![2];
    const cached = suggestionCache.get(cacheId);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    const dish = cached.dishes.get(dishShortId);
    if (!dish) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_error'));
      return;
    }

    try {
      let detail: RecipeDetail;

      if (dish.detail) {
        detail = dish.detail;
        await ctx.answerCallbackQuery();
      } else {
        await ctx.answerCallbackQuery();
        const hideLoading = await showLoading(ctx);
        try {
          detail = await getRecipeDetail(
            api,
            cached.userId,
            dish.dish_name_en,
            dish.dish_name_ua,
          );
          await hideLoading();
        } catch (err) {
          await hideLoading();
          throw err;
        }
        dish.detail = detail;
      }

      const text = formatRecipeDetail(detail, ctx.lang);
      const detailKb = buildRecipeDetailKeyboard(cacheId, dishShortId, ctx.lang);

      // Split if too long for Telegram (4096 char limit)
      if (text.length > 4000) {
        const splitIdx = text.indexOf(t(ctx.lang, 'cook_steps_title'));
        if (splitIdx > 0) {
          await ctx.editMessageText(text.substring(0, splitIdx), {
            parse_mode: 'HTML',
            reply_markup: detailKb,
          });
          await ctx.reply(text.substring(splitIdx), {
            parse_mode: 'HTML',
          });
        } else {
          await ctx.editMessageText(text.substring(0, 4000), {
            parse_mode: 'HTML',
            reply_markup: detailKb,
          });
        }
      } else {
        await ctx.editMessageText(text, {
          parse_mode: 'HTML',
          reply_markup: detailKb,
        });
      }
    } catch (err) {
      logger.error('Failed to get recipe detail', err);
      await ctx.reply(t(ctx.lang, 'cook_recipe_error'));
    }
  });

  // ── Cooked callback ──
  bot.callbackQuery(/^cooked:([^:]+):(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const dishShortId = ctx.match![2];
    const cached = suggestionCache.get(cacheId);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    const dish = cached.dishes.get(dishShortId);
    if (!dish || !dish.detail) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_error'));
      return;
    }

    const hideLoading = await showLoading(ctx);
    try {
      await ctx.answerCallbackQuery();

      const result = await consumeRecipe(
        api,
        cached.userId,
        dish.detail.ingredients
          .filter((ing) => ing.quantity_num > 0)
          .map((ing) => ({
            name_en: ing.name_en,
            quantity_num: ing.quantity_num,
            unit: ing.unit,
          })),
        {
          dish_name_en: dish.dish_name_en,
          dish_name_ua: dish.dish_name_ua,
          category: dish.category,
        },
      );
      await hideLoading();

      const currentText = formatRecipeDetail(dish.detail, ctx.lang);
      const confirmLine = '\n\n' + t(ctx.lang, 'cook_cooked_confirmed');
      const finalText = currentText + confirmLine;

      if (finalText.length > 4096) {
        await ctx.editMessageReplyMarkup({
          reply_markup: { inline_keyboard: [] },
        });
        await ctx.reply(t(ctx.lang, 'cook_cooked_confirmed'), {
          parse_mode: 'HTML',
        });
      } else {
        await ctx.editMessageText(finalText, { parse_mode: 'HTML' });
      }
    } catch (err) {
      await hideLoading();
      logger.error('Failed to consume recipe', err);
      await ctx.reply(t(ctx.lang, 'cook_consume_error'));
    }
  });

  // ── Show more callback ──
  bot.callbackQuery(/^more:(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const cached = suggestionCache.get(cacheId);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    const hideLoading = await showLoading(ctx);
    try {
      await ctx.answerCallbackQuery();

      const data = await getRecipeSuggestions(api, cached.userId, {
        exclude: cached.allShownDishNames,
      });
      await hideLoading();

      const hasResults =
        (data.can_cook?.length > 0 || data.need_to_buy?.length > 0) &&
        !data.empty_fridge;

      if (!hasResults) {
        await ctx.editMessageText(t(ctx.lang, 'cook_no_more'), {
          parse_mode: 'HTML',
        });
        return;
      }

      const { cacheId: newCacheId, dishIdMap } = cacheSuggestions(
        data,
        cached.userId,
        cached.allShownDishNames,
        cacheId,
      );

      const message = formatRecipeSuggestions(data, ctx.lang);
      const keyboard = buildDishKeyboard(data, newCacheId, dishIdMap, ctx.lang, true);

      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (err) {
      await hideLoading();
      logger.error('Failed to get more suggestions', err);
      await ctx.reply(t(ctx.lang, 'cook_error'));
    }
  });

  // ── Something else → show category picker ──
  bot.callbackQuery(/^diff:(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const cached = suggestionCache.get(cacheId);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    await ctx.answerCallbackQuery();

    // Create a picker cache entry that remembers the parent
    const pickerId = shortId();
    suggestionCache.set(pickerId, {
      userId: cached.userId,
      data: cached.data,
      dishes: new Map(),
      allShownDishNames: cached.allShownDishNames,
      previousCacheId: cacheId,
      categoryMask: ALL_CATEGORIES_MASK,
      createdAt: Date.now(),
    });

    const keyboard = buildCategoryPickerKeyboard(pickerId, ALL_CATEGORIES_MASK, ctx.lang);
    await ctx.editMessageText(t(ctx.lang, 'cook_pick_category'), {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });

  // ── Toggle single category ──
  bot.callbackQuery(/^tc:([^:]+):(\d)$/, async (ctx) => {
    const pickerId = ctx.match![1];
    const bitIndex = parseInt(ctx.match![2], 10);
    const cached = suggestionCache.get(pickerId);

    if (!cached || cached.categoryMask === undefined) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    await ctx.answerCallbackQuery();

    cached.categoryMask ^= 1 << bitIndex;

    const keyboard = buildCategoryPickerKeyboard(pickerId, cached.categoryMask, ctx.lang);
    await ctx.editMessageReplyMarkup({ reply_markup: keyboard });
  });

  // ── Toggle all categories ──
  bot.callbackQuery(/^ta:(.+)$/, async (ctx) => {
    const pickerId = ctx.match![1];
    const cached = suggestionCache.get(pickerId);

    if (!cached || cached.categoryMask === undefined) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    await ctx.answerCallbackQuery();

    cached.categoryMask = cached.categoryMask === ALL_CATEGORIES_MASK ? 0 : ALL_CATEGORIES_MASK;

    const keyboard = buildCategoryPickerKeyboard(pickerId, cached.categoryMask, ctx.lang);
    await ctx.editMessageReplyMarkup({ reply_markup: keyboard });
  });

  // ── Confirm category search ──
  bot.callbackQuery(/^go:(.+)$/, async (ctx) => {
    const pickerId = ctx.match![1];
    const cached = suggestionCache.get(pickerId);

    if (!cached || cached.categoryMask === undefined) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    if (cached.categoryMask === 0) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_cat_none_selected'));
      return;
    }

    const hideLoading = await showLoading(ctx);
    try {
      await ctx.answerCallbackQuery();

      const categories = cached.categoryMask === ALL_CATEGORIES_MASK
        ? undefined
        : selectedCategoriesToNames(cached.categoryMask);

      const data = await getRecipeSuggestions(api, cached.userId, {
        exclude: cached.allShownDishNames,
        mode: 'creative',
        categories,
      });
      await hideLoading();

      const hasResults =
        (data.can_cook?.length > 0 || data.need_to_buy?.length > 0) &&
        !data.empty_fridge;

      if (!hasResults) {
        await ctx.editMessageText(t(ctx.lang, 'cook_no_more'), {
          parse_mode: 'HTML',
        });
        return;
      }

      const { cacheId: newCacheId, dishIdMap } = cacheSuggestions(
        data,
        cached.userId,
        cached.allShownDishNames,
        cached.previousCacheId,
      );

      const message = formatRecipeSuggestions(data, ctx.lang);
      const keyboard = buildDishKeyboard(data, newCacheId, dishIdMap, ctx.lang, true);

      await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        reply_markup: keyboard,
      });
    } catch (err) {
      await hideLoading();
      logger.error('Failed to get filtered suggestions', err);
      await ctx.reply(t(ctx.lang, 'cook_error'));
    }
  });

  // ── Previous page callback ──
  bot.callbackQuery(/^prev:(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const cached = suggestionCache.get(cacheId);

    if (!cached?.previousCacheId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    const prev = suggestionCache.get(cached.previousCacheId);
    if (!prev) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    await ctx.answerCallbackQuery();

    const message = formatRecipeSuggestions(prev.data, ctx.lang);
    const dishIdMap = new Map<string, string>();
    for (const [sid, dish] of prev.dishes) {
      dishIdMap.set(sid, dish.dish_name_en);
    }
    const keyboard = buildDishKeyboard(
      prev.data,
      cached.previousCacheId,
      dishIdMap,
      ctx.lang,
      !!prev.previousCacheId,
    );

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });

  // ── Back to suggestions callback ──
  bot.callbackQuery(/^back:(.+)$/, async (ctx) => {
    const cacheId = ctx.match![1];
    const cached = suggestionCache.get(cacheId);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'cook_recipe_expired'));
      return;
    }

    await ctx.answerCallbackQuery();

    const message = formatRecipeSuggestions(cached.data, ctx.lang);
    const dishIdMap = new Map<string, string>();
    for (const [sid, dish] of cached.dishes) {
      dishIdMap.set(sid, dish.dish_name_en);
    }
    const keyboard = buildDishKeyboard(
      cached.data,
      cacheId,
      dishIdMap,
      ctx.lang,
      !!cached.previousCacheId,
    );

    await ctx.editMessageText(message, {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });
}
