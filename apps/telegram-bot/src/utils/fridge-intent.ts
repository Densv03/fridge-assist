import { ApiClient } from '../api-client/api-client';
import { getInventory } from '../api-client/inventory.api';
import { formatInventoryList } from '../formatters/inventory.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { showLoading } from './loading';

export async function handleFridgeIntent(
  ctx: BotContext & { lang: 'ua' | 'en'; internalUserId?: string },
  api: ApiClient,
): Promise<void> {
  const hideLoading = await showLoading(ctx);
  try {
    const items = await getInventory(api, ctx.internalUserId!);
    await hideLoading();
    const message = formatInventoryList(items, ctx.lang);
    await ctx.reply(message, { parse_mode: 'HTML' });
  } catch (err) {
    await hideLoading();
    throw err;
  }
}
