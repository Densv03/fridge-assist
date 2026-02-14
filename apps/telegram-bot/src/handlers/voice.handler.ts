import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { previewAudio } from '../api-client/confirmation.api';
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
import { showLoading } from '../utils/loading';

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

    const hideLoading = await showLoading(ctx);
    try {
      const voice = ctx.message.voice;
      const file = await ctx.api.getFile(voice.file_id);

      if (!file.file_path) {
        await hideLoading();
        await ctx.reply(t(ctx.lang, 'voice_download_error'));
        return;
      }

      const buffer = await downloadTelegramFile(
        file.file_path,
        config.telegramBotToken,
      );

      const preview = await previewAudio(
        api,
        ctx.internalUserId!,
        buffer,
        'voice.ogg',
        'audio/ogg',
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
        return;
      }

      // No items
      if (preview.items.length === 0 && preview.clarifications.length === 0) {
        await ctx.reply(t(ctx.lang, 'no_items_found'));
        return;
      }

      // Show preview with inline keyboard
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

      await ctx.reply(text, {
        parse_mode: 'HTML',
        reply_markup: kb,
      });
    } catch (err) {
      await hideLoading();
      logger.error('Failed to process voice message', err);
      await ctx.reply(t(ctx.lang, 'voice_error'));
    }
  });
}
