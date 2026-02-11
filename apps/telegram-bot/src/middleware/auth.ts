import { Context, MiddlewareFn } from 'grammy';
import { ApiClient } from '../api-client/api-client';
import { resolveUser } from '../api-client/users.api';
import { Lang } from '../i18n/locales';
import { logger } from '../utils/logger';

function toLang(value?: string): Lang {
  return value === 'en' ? 'en' : 'ua';
}

export interface BotContext extends Context {
  internalUserId?: string;
  isRegistered: boolean;
  lang: Lang;
}

interface CachedUser {
  userId: string;
  hasPhone: boolean;
  lang: Lang;
}

const userCache = new Map<number, CachedUser>();

export function clearCachedUser(telegramId: number): void {
  userCache.delete(telegramId);
}

export function updateCachedUser(
  telegramId: number,
  updates: Partial<CachedUser>,
): void {
  const existing = userCache.get(telegramId);
  if (existing) {
    userCache.set(telegramId, { ...existing, ...updates });
  }
}

export function updateCachedLang(telegramId: number, lang: Lang): void {
  updateCachedUser(telegramId, { lang });
}

export function authMiddleware(api: ApiClient): MiddlewareFn<BotContext> {
  return async (ctx, next) => {
    const from = ctx.from;
    if (!from) {
      ctx.isRegistered = false;
      ctx.lang = 'ua';
      return next();
    }

    const cached = userCache.get(from.id);
    if (cached) {
      ctx.internalUserId = cached.userId;
      ctx.isRegistered = cached.hasPhone;
      ctx.lang = cached.lang;
      return next();
    }

    try {
      const user = await resolveUser(
        api,
        from.id,
        from.first_name,
        from.last_name,
      );

      const hasPhone = !!user.phone;
      const lang = toLang(user.preferred_language);
      userCache.set(from.id, { userId: user.id, hasPhone, lang });
      ctx.internalUserId = user.id;
      ctx.isRegistered = hasPhone;
      ctx.lang = lang;
    } catch (err) {
      logger.error('Failed to resolve user', from.id, err);
      ctx.isRegistered = false;
      ctx.lang = 'ua';
    }

    return next();
  };
}
