import {
  RecipeSuggestionsResponse,
  RecipeSuggestion,
  RecipeDetail,
} from '../api-client/types';
import { InlineKeyboard } from 'grammy';
import { Lang, t } from '../i18n/locales';

const CATEGORY_EMOJI: Record<string, string> = {
  Breakfast: '🌅',
  Lunch: '🍽',
  Dinner: '🌙',
  Snack: '🥪',
  Dessert: '🍰',
  Drink: '🍹',
};

export const MEAL_CATEGORIES = [
  { key: 'Breakfast', bit: 0, emoji: '🌅', i18nKey: 'cook_cat_breakfast' },
  { key: 'Lunch', bit: 1, emoji: '🍽', i18nKey: 'cook_cat_lunch' },
  { key: 'Dinner', bit: 2, emoji: '🌙', i18nKey: 'cook_cat_dinner' },
  { key: 'Snack', bit: 3, emoji: '🥪', i18nKey: 'cook_cat_snack' },
  { key: 'Dessert', bit: 4, emoji: '🍰', i18nKey: 'cook_cat_dessert' },
  { key: 'Drink', bit: 5, emoji: '🍹', i18nKey: 'cook_cat_drink' },
] as const;

export const ALL_CATEGORIES_MASK = 63; // 0b111111

export function selectedCategoriesToNames(mask: number): string[] {
  return MEAL_CATEGORIES
    .filter((cat) => mask & (1 << cat.bit))
    .map((cat) => cat.key);
}

export function buildCategoryPickerKeyboard(
  cacheId: string,
  selectedMask: number,
  lang: Lang,
): InlineKeyboard {
  const kb = new InlineKeyboard();

  for (let i = 0; i < MEAL_CATEGORIES.length; i++) {
    const cat = MEAL_CATEGORIES[i];
    const isSelected = (selectedMask & (1 << cat.bit)) !== 0;
    const label = `${isSelected ? '✅' : '☐'} ${cat.emoji} ${t(lang, cat.i18nKey)}`;
    kb.text(label, `tc:${cacheId}:${cat.bit}`);
    if (i % 2 === 1) kb.row();
  }

  const allSelected = selectedMask === ALL_CATEGORIES_MASK;
  kb.text(
    t(lang, allSelected ? 'cook_cat_deselect_all' : 'cook_cat_select_all'),
    `ta:${cacheId}`,
  ).row();

  kb.text(t(lang, 'cook_back_button'), `back:${cacheId}`)
    .text(t(lang, 'cook_cat_go'), `go:${cacheId}`)
    .row();

  return kb;
}

function formatDish(dish: RecipeSuggestion, index: number, lang: Lang): string {
  const emoji = CATEGORY_EMOJI[dish.category] || '🍽';
  const name = lang === 'ua' ? dish.dish_name_ua : dish.dish_name_en;
  return `${index}. ${emoji} <b>${name}</b>`;
}

export function formatRecipeSuggestions(
  data: RecipeSuggestionsResponse,
  lang: Lang,
): string {
  if (data.empty_fridge) {
    return t(lang, 'cook_empty_fridge');
  }

  const lines: string[] = [];

  if (data.can_cook.length > 0) {
    lines.push(t(lang, 'cook_can_cook_title'));
    data.can_cook.forEach((dish, i) => {
      lines.push(formatDish(dish, i + 1, lang));
    });
  }

  if (data.need_to_buy.length > 0) {
    lines.push(t(lang, 'cook_need_buy_title'));
    data.need_to_buy.forEach((dish, i) => {
      lines.push(formatDish(dish, i + 1, lang));
      if (dish.missing_ingredients && dish.missing_ingredients.length > 0) {
        const missing = dish.missing_ingredients
          .map((m) => (lang === 'ua' ? m.name_ua : m.name_en))
          .join(', ');
        lines.push(`   ${t(lang, 'cook_missing').replace('{items}', missing)}`);
      }
    });
  }

  lines.push(t(lang, 'cook_choose_dish'));

  return lines.join('\n');
}

export function buildDishKeyboard(
  data: RecipeSuggestionsResponse,
  cacheId: string,
  dishIdMap: Map<string, string>,
  lang: Lang,
  hasPrevious = false,
): InlineKeyboard {
  const kb = new InlineKeyboard();

  const allDishes = [...data.can_cook, ...data.need_to_buy];
  for (const dish of allDishes) {
    const name = lang === 'ua' ? dish.dish_name_ua : dish.dish_name_en;
    // Find the short id for this dish
    let dishShortId = '';
    for (const [sid, nameEn] of dishIdMap) {
      if (nameEn === dish.dish_name_en) {
        dishShortId = sid;
        break;
      }
    }
    kb.text(name, `rcp:${cacheId}:${dishShortId}`).row();
  }

  if (hasPrevious) {
    kb.text(t(lang, 'cook_prev_button'), `prev:${cacheId}`).row();
  }

  kb.text(t(lang, 'cook_show_more_button'), `more:${cacheId}`)
    .text(t(lang, 'cook_something_else_button'), `diff:${cacheId}`)
    .row();

  return kb;
}

export function buildBackKeyboard(cacheId: string, lang: Lang): InlineKeyboard {
  const kb = new InlineKeyboard();
  kb.text(t(lang, 'cook_back_button'), `back:${cacheId}`);
  return kb;
}

export function buildRecipeDetailKeyboard(
  cacheId: string,
  dishShortId: string,
  lang: Lang,
): InlineKeyboard {
  const kb = new InlineKeyboard();
  kb.text(t(lang, 'cook_back_button'), `back:${cacheId}`);
  kb.text(t(lang, 'cook_cooked_button'), `cooked:${cacheId}:${dishShortId}`);
  return kb;
}

export function formatRecipeDetail(detail: RecipeDetail, lang: Lang): string {
  const name = lang === 'ua' ? detail.dish_name_ua : detail.dish_name_en;

  const lines: string[] = [];

  lines.push(t(lang, 'cook_recipe_title').replace('{name}', name));
  lines.push(
    t(lang, 'cook_servings').replace('{count}', String(detail.servings)),
  );
  lines.push(
    t(lang, 'cook_time').replace('{minutes}', String(detail.cook_time_minutes)),
  );

  lines.push(t(lang, 'cook_ingredients_title'));
  for (const ing of detail.ingredients) {
    const ingName = lang === 'ua' ? ing.name_ua : ing.name_en;
    const qty = lang === 'ua' ? ing.quantity_ua : ing.quantity;
    lines.push(`  • ${ingName} — ${qty}`);
  }

  lines.push(t(lang, 'cook_steps_title'));
  detail.steps.forEach((step, i) => {
    const text = lang === 'ua' ? step.step_ua : step.step_en;
    lines.push(`  ${i + 1}. ${text}`);
  });

  return lines.join('\n');
}
