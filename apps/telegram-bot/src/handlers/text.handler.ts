import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { ingestText } from '../api-client/ingestion.api';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';

export function registerTextHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.on('message:text', async (ctx) => {
    // Skip commands — they're handled by other handlers
    if (ctx.message.text.startsWith('/')) return;

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

    try {
      await ctx.replyWithChatAction('typing');
      const result = await ingestText(
        api,
        ctx.internalUserId!,
        ctx.message.text,
      );
      await ctx.reply(formatIngestionResult(result, ctx.lang), {
        parse_mode: 'HTML',
      });
    } catch (err) {
      logger.error('Failed to process text', err);
      await ctx.reply(t(ctx.lang, 'text_error'));
    }
  });
}
