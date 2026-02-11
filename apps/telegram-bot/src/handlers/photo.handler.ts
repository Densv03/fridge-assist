import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { ingestImage, ingestText } from '../api-client/ingestion.api';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { downloadTelegramFile } from '../utils/file-download';
import { logger } from '../utils/logger';
import { config } from '../config';

export function registerPhotoHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  bot.on('message:photo', async (ctx) => {
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
      const photos = ctx.message.photo;
      const largest = photos[photos.length - 1];
      const file = await ctx.api.getFile(largest.file_id);

      if (!file.file_path) {
        await ctx.reply(t(ctx.lang, 'photo_download_error'));
        return;
      }

      await ctx.replyWithChatAction('upload_photo');
      const buffer = await downloadTelegramFile(
        file.file_path,
        config.telegramBotToken,
      );

      const ext = file.file_path.split('.').pop() || 'jpg';
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

      const result = await ingestImage(
        api,
        ctx.internalUserId!,
        buffer,
        `photo.${ext}`,
        mime,
      );
      await ctx.reply(formatIngestionResult(result, ctx.lang), {
        parse_mode: 'HTML',
      });

      // Process caption as separate text ingestion
      const caption = ctx.message.caption;
      if (caption) {
        await ctx.replyWithChatAction('typing');
        const textResult = await ingestText(api, ctx.internalUserId!, caption);
        await ctx.reply(formatIngestionResult(textResult, ctx.lang), {
          parse_mode: 'HTML',
        });
      }
    } catch (err) {
      logger.error('Failed to process photo', err);
      await ctx.reply(t(ctx.lang, 'photo_error'));
    }
  });
}
