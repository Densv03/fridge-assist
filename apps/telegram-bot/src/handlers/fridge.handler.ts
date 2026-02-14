import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { getInventory } from '../api-client/inventory.api';
import { formatInventoryList } from '../formatters/inventory.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';
import { showLoading } from '../utils/loading';

export function registerFridgeHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.command('fridge', async (ctx) => {
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
      const items = await getInventory(api, ctx.internalUserId!);
      await hideLoading();
      const message = formatInventoryList(items, ctx.lang);
      await ctx.reply(message, { parse_mode: 'HTML' });
    } catch (err) {
      await hideLoading();
      logger.error('Failed to get inventory', err);
      await ctx.reply(t(ctx.lang, 'fridge_error'));
    }
  });
}
