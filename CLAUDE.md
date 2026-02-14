# Fridge Assist

Nx monorepo with two apps that help users manage fridge inventory and get recipe suggestions.

## Apps

| App | Path | Stack |
|-----|------|-------|
| **API** | `apps/api` | NestJS + Supabase + Google Gemini |
| **Telegram Bot** | `apps/telegram-bot` | grammy + axios |

## Commands

```bash
npx nx build api              # Build API
npx nx build telegram-bot     # Build bot
npx nx serve api              # Dev server (http://localhost:3000/api)
npx nx serve telegram-bot     # Dev bot (long polling)
npx nx lint api               # Lint API
npx nx lint telegram-bot      # Lint bot
```

## Tech Stack

- **Runtime**: Node 20
- **Package manager**: npm (workspaces)
- **Monorepo**: Nx 22
- **API**: NestJS, Supabase (Postgres), Google Gemini AI, class-validator/class-transformer
- **Bot**: grammy, axios, custom i18n (ua/en)

## npm Cache Note

If npm commands fail with permission errors, run:
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```
Or use `NPM_CONFIG_CACHE=/tmp/npm-cache-fix` as a one-off workaround.
