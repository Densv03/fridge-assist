import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { ingestAudio } from '../api-client/ingestion.api';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { downloadTelegramFile } from '../utils/file-download';
import { logger } from '../utils/logger';
import { config } from '../config';

export function registerVoiceHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.on('message:voice', async (ctx) => {
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
      const voice = ctx.message.voice;
      const file = await ctx.api.getFile(voice.file_id);

      if (!file.file_path) {
        await ctx.reply(t(ctx.lang, 'voice_download_error'));
        return;
      }

      await ctx.replyWithChatAction('typing');
      const buffer = await downloadTelegramFile(
        file.file_path,
        config.telegramBotToken,
      );

      const result = await ingestAudio(
        api,
        ctx.internalUserId!,
        buffer,
        'voice.ogg',
        'audio/ogg',
      );
      await ctx.reply(formatIngestionResult(result, ctx.lang), {
        parse_mode: 'HTML',
      });
    } catch (err) {
      logger.error('Failed to process voice message', err);
      await ctx.reply(t(ctx.lang, 'voice_error'));
    }
  });
}
