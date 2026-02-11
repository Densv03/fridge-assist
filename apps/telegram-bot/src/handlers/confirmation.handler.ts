import { Bot } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import {
  confirmPreview,
  cancelPreview,
  removePreviewItem,
  resolveAmbiguous,
  addCustomItem,
  replacePreviewItem,
  changePreviewItemAmount,
} from '../api-client/confirmation.api';
import { ExtractionPreview } from '../api-client/types';
import {
  formatPreview,
  buildPreviewKeyboard,
} from '../formatters/confirmation.formatter';
import { formatIngestionResult } from '../formatters/ingestion.formatter';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';
import { randomBytes } from 'crypto';

// ── In-memory preview cache ──

interface CachedPreview {
  previewId: string;
  userId: string;
  itemIdMap: Map<string, string>; // short → full UUID
  candidateIdMap: Map<string, string>; // short → full UUID
  itemNameMap: Map<string, { name: string; name_ua?: string }>; // short → display names
  createdAt: number;
}

const previewCache = new Map<string, CachedPreview>();

// Custom item conversation state
interface CustomItemState {
  previewId: string;
  itemId: string;
  messageId: number;
  previewMessageId: number;
  userId: string;
  shortId: string;
  createdAt: number;
}

const customItemState = new Map<number, CustomItemState>(); // chatId → state

// Replace item conversation state
interface ReplaceItemState {
  previewId: string;
  itemId: string;
  messageId: number;
  previewMessageId: number;
  userId: string;
  shortId: string;
  createdAt: number;
}

const replaceItemState = new Map<number, ReplaceItemState>(); // chatId → state

// Change amount conversation state
interface ChangeAmountState {
  previewId: string;
  itemId: string;
  messageId: number;
  previewMessageId: number;
  userId: string;
  shortId: string;
  createdAt: number;
}

const changeAmountState = new Map<number, ChangeAmountState>(); // chatId → state

const TTL_MS = 15 * 60 * 1000; // 15 minutes

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of previewCache) {
    if (now - entry.createdAt > TTL_MS) previewCache.delete(key);
  }
  for (const [key, entry] of customItemState) {
    if (now - entry.createdAt > TTL_MS) customItemState.delete(key);
  }
  for (const [key, entry] of replaceItemState) {
    if (now - entry.createdAt > TTL_MS) replaceItemState.delete(key);
  }
  for (const [key, entry] of changeAmountState) {
    if (now - entry.createdAt > TTL_MS) changeAmountState.delete(key);
  }
}, 5 * 60 * 1000);

function shortId(): string {
  return randomBytes(4).toString('hex'); // 8 hex chars
}

function buildIdMaps(preview: ExtractionPreview) {
  const itemIdMap = new Map<string, string>();
  const candidateIdMap = new Map<string, string>();
  const itemNameMap = new Map<string, { name: string; name_ua?: string }>();

  for (const item of preview.items) {
    const sid = shortId();
    itemIdMap.set(sid, item.id);
    itemNameMap.set(sid, {
      name: item.canonical_name,
      name_ua: item.canonical_name_ua,
    });
  }
  for (const c of preview.clarifications) {
    const sid = shortId();
    itemIdMap.set(sid, c.id);
    itemNameMap.set(sid, { name: c.raw_name });
    for (const cand of c.candidates) {
      if (!candidateIdMap.has(cand.id)) {
        candidateIdMap.set(shortId(), cand.id);
      }
    }
  }

  return { itemIdMap, candidateIdMap, itemNameMap };
}

export function cachePreview(
  preview: ExtractionPreview,
  userId: string,
): {
  shortId: string;
  itemIdMap: Map<string, string>;
  candidateIdMap: Map<string, string>;
} {
  const sid = shortId();
  const { itemIdMap, candidateIdMap, itemNameMap } = buildIdMaps(preview);

  previewCache.set(sid, {
    previewId: preview.preview_id,
    userId,
    itemIdMap,
    candidateIdMap,
    itemNameMap,
    createdAt: Date.now(),
  });

  return { shortId: sid, itemIdMap, candidateIdMap };
}

function rebuildCache(
  oldShortId: string,
  preview: ExtractionPreview,
  userId: string,
): {
  shortId: string;
  itemIdMap: Map<string, string>;
  candidateIdMap: Map<string, string>;
} {
  // Remove old cache entry
  previewCache.delete(oldShortId);

  // Create new cache
  return cachePreview(preview, userId);
}

export function registerConfirmationHandler(
  bot: Bot<BotContext>,
  api: ApiClient,
): void {
  // ── Confirm ──
  bot.callbackQuery(/^cfm:(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    try {
      const result = await confirmPreview(api, cached.userId, cached.previewId);
      previewCache.delete(sid);

      const text =
        t(ctx.lang, 'preview_confirmed') +
        '\n\n' +
        formatIngestionResult(result, ctx.lang);

      await ctx.editMessageText(text, { parse_mode: 'HTML' });
      await ctx.answerCallbackQuery();
    } catch (err: any) {
      logger.error('Failed to confirm preview', err);
      if (err?.response?.status === 410) {
        await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
        previewCache.delete(sid);
      } else {
        await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      }
    }
  });

  // ── Cancel ──
  bot.callbackQuery(/^cxl:(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    try {
      await cancelPreview(api, cached.userId, cached.previewId);
      previewCache.delete(sid);
      await ctx.editMessageText(t(ctx.lang, 'preview_cancelled'), {
        parse_mode: 'HTML',
      });
      await ctx.answerCallbackQuery();
    } catch (err) {
      logger.error('Failed to cancel preview', err);
      await ctx.answerCallbackQuery(t(ctx.lang, 'cancel_error'));
    }
  });

  // ── Remove item ──
  bot.callbackQuery(/^rm:([^:]+):(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const itemShort = ctx.match![2];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    const fullItemId = cached.itemIdMap.get(itemShort);
    if (!fullItemId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      return;
    }

    try {
      const updated = await removePreviewItem(
        api,
        cached.userId,
        cached.previewId,
        fullItemId,
      );

      // If all items removed (auto-cancelled)
      if (updated.items.length === 0 && updated.clarifications.length === 0) {
        previewCache.delete(sid);
        await ctx.editMessageText(t(ctx.lang, 'preview_cancelled'), {
          parse_mode: 'HTML',
        });
        await ctx.answerCallbackQuery();
        return;
      }

      // Rebuild cache with new IDs
      const {
        shortId: newSid,
        itemIdMap,
        candidateIdMap,
      } = rebuildCache(sid, updated, cached.userId);

      const text = formatPreview(updated, ctx.lang);
      const kb = buildPreviewKeyboard(
        updated,
        newSid,
        itemIdMap,
        candidateIdMap,
        ctx.lang,
      );

      await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: kb,
      });
      await ctx.answerCallbackQuery();
    } catch (err: any) {
      logger.error('Failed to remove preview item', err);
      if (err?.response?.status === 410) {
        await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
        previewCache.delete(sid);
      } else {
        await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      }
    }
  });

  // ── Resolve ambiguous ──
  bot.callbackQuery(/^res:([^:]+):([^:]+):(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const itemShort = ctx.match![2];
    const candShort = ctx.match![3];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    const fullItemId = cached.itemIdMap.get(itemShort);
    const fullCandId = cached.candidateIdMap.get(candShort);
    if (!fullItemId || !fullCandId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      return;
    }

    try {
      const updated = await resolveAmbiguous(
        api,
        cached.userId,
        cached.previewId,
        fullItemId,
        fullCandId,
      );

      const {
        shortId: newSid,
        itemIdMap,
        candidateIdMap,
      } = rebuildCache(sid, updated, cached.userId);

      const text = formatPreview(updated, ctx.lang);
      const kb = buildPreviewKeyboard(
        updated,
        newSid,
        itemIdMap,
        candidateIdMap,
        ctx.lang,
      );

      await ctx.editMessageText(text, {
        parse_mode: 'HTML',
        reply_markup: kb,
      });
      await ctx.answerCallbackQuery();
    } catch (err: any) {
      logger.error('Failed to resolve ambiguous item', err);
      if (err?.response?.status === 410) {
        await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
        previewCache.delete(sid);
      } else {
        await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      }
    }
  });

  // ── Add custom (start conversation) ──
  bot.callbackQuery(/^cst:([^:]+):(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const itemShort = ctx.match![2];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    const fullItemId = cached.itemIdMap.get(itemShort);
    if (!fullItemId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      return;
    }

    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const previewMessageId = ctx.callbackQuery.message?.message_id ?? 0;

    const itemNames = cached.itemNameMap.get(itemShort);
    const displayName =
      ctx.lang === 'ua'
        ? itemNames?.name_ua || itemNames?.name || '?'
        : itemNames?.name || '?';

    const promptText = t(ctx.lang, 'custom_item_prompt').replace(
      '{item}',
      displayName,
    );

    const msg = await ctx.reply(promptText, { parse_mode: 'HTML' });

    customItemState.set(chatId, {
      previewId: cached.previewId,
      itemId: fullItemId,
      messageId: msg.message_id,
      previewMessageId,
      userId: cached.userId,
      shortId: sid,
      createdAt: Date.now(),
    });

    await ctx.answerCallbackQuery();
  });

  // ── Replace item (start conversation) ──
  bot.callbackQuery(/^rpl:([^:]+):(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const itemShort = ctx.match![2];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    const fullItemId = cached.itemIdMap.get(itemShort);
    if (!fullItemId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      return;
    }

    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const previewMessageId = ctx.callbackQuery.message?.message_id ?? 0;

    const itemNames = cached.itemNameMap.get(itemShort);
    const displayName =
      ctx.lang === 'ua'
        ? itemNames?.name_ua || itemNames?.name || '?'
        : itemNames?.name || '?';

    const promptText = t(ctx.lang, 'replace_item_prompt').replace(
      '{item}',
      displayName,
    );

    const msg = await ctx.reply(promptText, {
      parse_mode: 'HTML',
    });

    replaceItemState.set(chatId, {
      previewId: cached.previewId,
      itemId: fullItemId,
      messageId: msg.message_id,
      previewMessageId,
      userId: cached.userId,
      shortId: sid,
      createdAt: Date.now(),
    });

    await ctx.answerCallbackQuery();
  });

  // ── Change amount (start conversation) ──
  bot.callbackQuery(/^qty:([^:]+):(.+)$/, async (ctx) => {
    const sid = ctx.match![1];
    const itemShort = ctx.match![2];
    const cached = previewCache.get(sid);

    if (!cached) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'preview_expired'));
      return;
    }

    const fullItemId = cached.itemIdMap.get(itemShort);
    if (!fullItemId) {
      await ctx.answerCallbackQuery(t(ctx.lang, 'confirm_error'));
      return;
    }

    const chatId = ctx.chat?.id;
    if (!chatId) return;

    const previewMessageId = ctx.callbackQuery.message?.message_id ?? 0;

    const itemNames = cached.itemNameMap.get(itemShort);
    const displayName =
      ctx.lang === 'ua'
        ? itemNames?.name_ua || itemNames?.name || '?'
        : itemNames?.name || '?';

    const promptText = t(ctx.lang, 'change_amount_prompt').replace(
      '{item}',
      displayName,
    );

    const msg = await ctx.reply(promptText, {
      parse_mode: 'HTML',
    });

    changeAmountState.set(chatId, {
      previewId: cached.previewId,
      itemId: fullItemId,
      messageId: msg.message_id,
      previewMessageId,
      userId: cached.userId,
      shortId: sid,
      createdAt: Date.now(),
    });

    await ctx.answerCallbackQuery();
  });

  // ── Handle custom item / replace item / change amount text input ──
  bot.on('message:text', async (ctx, next) => {
    const chatId = ctx.chat.id;
    const customState = customItemState.get(chatId);
    const replaceState = replaceItemState.get(chatId);
    const amountState = changeAmountState.get(chatId);

    if (!customState && !replaceState && !amountState) {
      return next();
    }

    const name = ctx.message.text.trim();
    if (!name || name.startsWith('/')) {
      customItemState.delete(chatId);
      replaceItemState.delete(chatId);
      changeAmountState.delete(chatId);
      return next();
    }

    // ── Handle custom item ──
    if (customState) {
      customItemState.delete(chatId);

      try {
        const updated = await addCustomItem(
          api,
          customState.userId,
          customState.previewId,
          customState.itemId,
          name,
        );

        await ctx.reply(
          t(ctx.lang, 'custom_item_added').replace('{name}', name),
          { parse_mode: 'HTML' },
        );

        const cached = previewCache.get(customState.shortId);
        if (cached) {
          const {
            shortId: newSid,
            itemIdMap,
            candidateIdMap,
          } = rebuildCache(customState.shortId, updated, customState.userId);

          const text = formatPreview(updated, ctx.lang);
          const kb = buildPreviewKeyboard(
            updated,
            newSid,
            itemIdMap,
            candidateIdMap,
            ctx.lang,
          );

          try {
            await ctx.api.editMessageText(
              chatId,
              customState.previewMessageId,
              text,
              { parse_mode: 'HTML', reply_markup: kb },
            );
          } catch {
            await ctx.reply(text, { parse_mode: 'HTML', reply_markup: kb });
          }
        }
      } catch (err) {
        logger.error('Failed to add custom item', err);
        await ctx.reply(t(ctx.lang, 'confirm_error'));
      }
      return;
    }

    // ── Handle replace item ──
    if (replaceState) {
      replaceItemState.delete(chatId);

      try {
        const updated = await replacePreviewItem(
          api,
          replaceState.userId,
          replaceState.previewId,
          replaceState.itemId,
          name,
        );

        await ctx.reply(t(ctx.lang, 'replace_item_done'), {
          parse_mode: 'HTML',
        });

        const cached = previewCache.get(replaceState.shortId);
        if (cached) {
          const {
            shortId: newSid,
            itemIdMap,
            candidateIdMap,
          } = rebuildCache(replaceState.shortId, updated, replaceState.userId);

          const text = formatPreview(updated, ctx.lang);
          const kb = buildPreviewKeyboard(
            updated,
            newSid,
            itemIdMap,
            candidateIdMap,
            ctx.lang,
          );

          try {
            await ctx.api.editMessageText(
              chatId,
              replaceState.previewMessageId,
              text,
              { parse_mode: 'HTML', reply_markup: kb },
            );
          } catch {
            await ctx.reply(text, { parse_mode: 'HTML', reply_markup: kb });
          }
        }
      } catch (err) {
        logger.error('Failed to replace item', err);
        await ctx.reply(t(ctx.lang, 'confirm_error'));
      }
      return;
    }

    // ── Handle change amount ──
    if (amountState) {
      try {
        const updated = await changePreviewItemAmount(
          api,
          amountState.userId,
          amountState.previewId,
          amountState.itemId,
          name,
        );

        changeAmountState.delete(chatId);

        await ctx.reply(t(ctx.lang, 'change_amount_done'), {
          parse_mode: 'HTML',
        });

        const cached = previewCache.get(amountState.shortId);
        if (cached) {
          const {
            shortId: newSid,
            itemIdMap,
            candidateIdMap,
          } = rebuildCache(amountState.shortId, updated, amountState.userId);

          const text = formatPreview(updated, ctx.lang);
          const kb = buildPreviewKeyboard(
            updated,
            newSid,
            itemIdMap,
            candidateIdMap,
            ctx.lang,
          );

          try {
            await ctx.api.editMessageText(
              chatId,
              amountState.previewMessageId,
              text,
              { parse_mode: 'HTML', reply_markup: kb },
            );
          } catch {
            await ctx.reply(text, { parse_mode: 'HTML', reply_markup: kb });
          }
        }
      } catch (err: any) {
        logger.error('Failed to change amount', err);
        if (err?.response?.status === 400) {
          // Keep state so user can retry
          await ctx.reply(t(ctx.lang, 'change_amount_invalid'));
        } else {
          changeAmountState.delete(chatId);
          await ctx.reply(t(ctx.lang, 'confirm_error'));
        }
      }
      return;
    }
  });
}
