---
path: apps/telegram-bot/**
---

# Telegram Bot Patterns (grammy)

## Handler Pattern

Each handler exports a `register*Handler` function and is registered in `main.ts`:

```typescript
export function registerExampleHandler(bot: Bot<BotContext>, api: ApiClient): void {
  bot.command('example', async (ctx) => { /* ... */ });
}
```

Registration order in `main.ts` matters — text handler must be last (it catches unmatched text). Some handlers only need `bot`, others also need `api`.

## Auth Check

Always check `ctx.isRegistered` before protected actions. If false, prompt for phone and return early:

```typescript
if (!ctx.isRegistered) {
  const keyboard = new Keyboard()
    .requestContact(t(ctx.lang, 'share_phone_button'))
    .resized().oneTime();
  await ctx.reply(t(ctx.lang, 'share_phone_prompt'), { reply_markup: keyboard });
  return;
}
```

## i18n

Use `t(ctx.lang, 'key')` from `i18n/locales.ts`. Always add both `ua` and `en` translations. Fallback chain: requested lang → English → raw key.

Helper functions `localizeUnit()` and `localizeCategory()` exist for domain-specific translations.

## Formatters

Separate file per domain in `formatters/` (e.g., `inventory.formatter.ts`, `cook.formatter.ts`). Return HTML strings, send with `parse_mode: 'HTML'`.

## API Client

Typed functions in `api-client/` directory. Each function takes `api: ApiClient` as first param, includes `x-user-id` header for authenticated endpoints:

```typescript
const { data } = await api.get<SomeType>('/endpoint', {
  headers: { 'x-user-id': userId },
});
```

Types live in `api-client/types.ts`.

## Config

Bot config is in `config.ts` using a plain object + `requireEnv()` helper — not NestJS ConfigModule.

## Error Handling

Wrap handler logic in try/catch. Log with `logger.error()`, reply with a user-friendly i18n message:

```typescript
try {
  // handler logic
} catch (err) {
  logger.error('Failed to do thing', err);
  await ctx.reply(t(ctx.lang, 'thing_error'));
}
```

Check `err?.response?.status` for specific HTTP error codes (e.g., 410 for expired resources). Use `ctx.answerCallbackQuery()` for callback query error responses.

Global error handler in `main.ts`: `bot.catch((err) => logger.error('Unhandled error:', err.error))`.
