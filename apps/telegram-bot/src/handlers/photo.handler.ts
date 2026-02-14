import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { previewImage, previewText } from '../api-client/confirmation.api';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import {
  formatPreview,
  buildPreviewKeyboard,
} from '../formatters/confirmation.formatter';
import { cachePreview } from './confirmation.handler';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { downloadTelegramFile } from '../utils/file-download';
import { logger } from '../utils/logger';
import { config } from '../config';
import { ExtractionPreview } from '../api-client/types';
import { showLoading } from '../utils/loading';

function sendPreview(
  ctx: BotContext & { lang: 'ua' | 'en'; internalUserId?: string },
  preview: ExtractionPreview,
) {
  const { shortId, itemIdMap, candidateIdMap } = cachePreview(
    preview,
    ctx.internalUserId!,
  );
  const text = formatPreview(preview, ctx.lang);
  const kb = buildPreviewKeyboard(
    preview,
    shortId,
    itemIdMap,
    candidateIdMap,
    ctx.lang,
  );
  return ctx.reply(text, { parse_mode: 'HTML', reply_markup: kb });
}

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

    const hideLoading = await showLoading(ctx);
    try {
      const photos = ctx.message.photo;
      const largest = photos[photos.length - 1];
      const file = await ctx.api.getFile(largest.file_id);

      if (!file.file_path) {
        await hideLoading();
        await ctx.reply(t(ctx.lang, 'photo_download_error'));
        return;
      }

      const buffer = await downloadTelegramFile(
        file.file_path,
        config.telegramBotToken,
      );

      const ext = file.file_path.split('.').pop() || 'jpg';
      const mime = ext === 'png' ? 'image/png' : 'image/jpeg';

      const preview = await previewImage(
        api,
        ctx.internalUserId!,
        buffer,
        `photo.${ext}`,
        mime,
      );
      await hideLoading();

      // CLEAR_ALL
      if (preview.intent === 'CLEAR_ALL') {
        const fakeResult = {
          status: 'completed' as const,
          processed_items: [],
          clarifications: [],
          transaction_ids: [],
          cleared_count: preview.cleared_count,
        };
        await ctx.reply(formatIngestionResult(fakeResult, ctx.lang), {
          parse_mode: 'HTML',
        });
      } else if (
        preview.items.length === 0 &&
        preview.clarifications.length === 0
      ) {
        await ctx.reply(t(ctx.lang, 'no_items_found'));
      } else {
        await sendPreview(ctx, preview);
      }

      // Process caption as separate text preview
      const caption = ctx.message.caption;
      if (caption) {
        const hideCaptionLoading = await showLoading(ctx);
        try {
          const textPreview = await previewText(
            api,
            ctx.internalUserId!,
            caption,
          );
          await hideCaptionLoading();

          if (textPreview.intent === 'CLEAR_ALL') {
            const fakeResult = {
              status: 'completed' as const,
              processed_items: [],
              clarifications: [],
              transaction_ids: [],
              cleared_count: textPreview.cleared_count,
            };
            await ctx.reply(formatIngestionResult(fakeResult, ctx.lang), {
              parse_mode: 'HTML',
            });
          } else if (
            textPreview.items.length > 0 ||
            textPreview.clarifications.length > 0
          ) {
            await sendPreview(ctx, textPreview);
          }
        } catch (captionErr) {
          await hideCaptionLoading();
          throw captionErr;
        }
      }
    } catch (err) {
      await hideLoading();
      logger.error('Failed to process photo', err);
      await ctx.reply(t(ctx.lang, 'photo_error'));
    }
  });
}
