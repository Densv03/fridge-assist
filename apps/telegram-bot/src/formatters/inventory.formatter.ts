import { InventoryItem } from '../api-client/types';
import { Lang, t, localizeUnit, localizeCategory } from '../i18n/locales';
import { formatForDisplay } from '../utils/unit-display';

const CATEGORY_EMOJI: Record<string, string> = {
  fruit: '🍎',
  fruits: '🍎',
  vegetable: '🥦',
  vegetables: '🥦',
  dairy: '🧀',
  meat: '🥩',
  seafood: '🐟',
  fish: '🐟',
  grain: '🌾',
  grains: '🌾',
  bakery: '🍞',
  bread: '🍞',
  beverage: '🍵',
  beverages: '🍵',
  drinks: '🍵',
  spice: '🧂',
  spices: '🧂',
  condiment: '🫙',
  condiments: '🫙',
  snack: '🍿',
  snacks: '🍿',
  frozen: '🧊',
  canned: '🥫',
  baking: '🧁',
  'dairy & eggs': '🧀',
  'grains & pasta': '🌾',
  'meat & poultry': '🥩',
  'oils & condiments': '🫙',
  'spices & seasonings': '🧂',
  'snacks & sweets': '🍦',
};

const STATUS_INDICATOR: Record<string, string> = {
  'In Stock': '🟢',
  'Low Stock': '🟡',
  'Out of Stock': '🔴',
};

function getCategoryEmoji(category?: string): string {
  if (!category) return '📦';
  return CATEGORY_EMOJI[category.toLowerCase()] || '📦';
}

export function formatInventoryList(items: InventoryItem[], lang: Lang): string {
  if (items.length === 0) {
    return t(lang, 'fridge_empty');
  }

  const grouped = new Map<string, InventoryItem[]>();
  for (const item of items) {
    const category = item.master_ingredients?.category || 'Other';
    const existing = grouped.get(category) || [];
    existing.push(item);
    grouped.set(category, existing);
  }

  const lines: string[] = [t(lang, 'fridge_title')];

  for (const [category, categoryItems] of grouped) {
    const emoji = getCategoryEmoji(category);
    const localizedCategory = localizeCategory(category, lang);
    lines.push(`${emoji} <b>${localizedCategory}</b>`);

    for (const item of categoryItems) {
      const status = STATUS_INDICATOR[item.status] || '';
      const name =
        lang === 'ua'
          ? item.master_ingredients?.canonical_name_ua ||
            item.master_ingredients?.canonical_name ||
            'Unknown'
          : item.master_ingredients?.canonical_name || 'Unknown';
      const display = formatForDisplay(item.quantity, item.unit);
      const unit = localizeUnit(display.unit, lang);
      lines.push(`  ${status} ${name} — ${display.quantity} ${unit}`);
    }

    lines.push('');
  }

  lines.push(
    `<i>${t(lang, 'fridge_total').replace('{count}', String(items.length))}</i>`,
  );

  return lines.join('\n');
}
