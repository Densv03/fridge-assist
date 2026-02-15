import { Bot, Keyboard } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { previewText } from '../api-client/confirmation.api';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import {
  formatPreview,
  buildPreviewKeyboard,
} from '../formatters/confirmation.formatter';
import { cachePreview } from './confirmation.handler';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';
import { showLoading } from '../utils/loading';
import { handleCookIntent } from '../utils/cook-intent';
import { handleFridgeIntent } from '../utils/fridge-intent';
import { handleReportIntent } from '../utils/report-intent';

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

    const hideLoading = await showLoading(ctx);
    try {
      const preview = await previewText(
        api,
        ctx.internalUserId!,
        ctx.message.text,
      );
      await hideLoading();

      // FRIDGE — show inventory
      if (preview.intent === 'FRIDGE') {
        await handleFridgeIntent(ctx, api);
        return;
      }

      // COOK — show recipe suggestions
      if (preview.intent === 'COOK') {
        await handleCookIntent(ctx, api, preview);
        return;
      }

      // REPORT — save bug/idea report
      if (preview.intent === 'REPORT') {
        await handleReportIntent(ctx, api, preview);
        return;
      }

      // CLEAR_ALL — processed immediately, show result
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

      // No items detected
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
      logger.error('Failed to process text', err);
      await ctx.reply(t(ctx.lang, 'text_error'));
    }
  });
}
