import { Bot, InlineKeyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { updateUser } from '../api-client/users.api';
import { BotContext, updateCachedLang } from '../middleware/auth';
import { Lang, t } from '../i18n/locales';
import { logger } from '../utils/logger';

export function registerLangHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.command('lang', async (ctx) => {
    const keyboard = new InlineKeyboard()
      .text('🇺🇦 Українська', 'lang:ua')
      .text('🇬🇧 English', 'lang:en');

    await ctx.reply(t(ctx.lang, 'lang_prompt'), {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });

  bot.callbackQuery(/^lang:(ua|en)$/, async (ctx) => {
    const lang = ctx.match![1] as Lang;
    const telegramId = ctx.from.id;

    updateCachedLang(telegramId, lang);
    ctx.lang = lang;

    // Persist to database
    if (ctx.internalUserId) {
      try {
        await updateUser(api, ctx.internalUserId, {
          preferred_language: lang,
        });
      } catch (err) {
        logger.error('Failed to persist language preference', err);
      }
    }

    await ctx.answerCallbackQuery();
    await ctx.editMessageText(t(lang, 'lang_changed'), { parse_mode: 'HTML' });
  });
}
