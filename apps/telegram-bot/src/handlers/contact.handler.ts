import { Bot } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { updateUser } from '../api-client/users.api';
import { BotContext, updateCachedUser } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';

export function registerContactHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.on('message:contact', async (ctx) => {
    const contact = ctx.message.contact;

    if (!ctx.internalUserId) {
      await ctx.reply(t(ctx.lang, 'generic_error'));
      return;
    }

    try {
      await updateUser(api, ctx.internalUserId, {
        phone: contact.phone_number,
      });

      updateCachedUser(ctx.from.id, { hasPhone: true });

      await ctx.reply(t(ctx.lang, 'phone_saved'), {
        parse_mode: 'HTML',
        reply_markup: { remove_keyboard: true },
      });
    } catch (err) {
      logger.error('Failed to save phone number', err);
      await ctx.reply(t(ctx.lang, 'phone_save_error'));
    }
  });
}
