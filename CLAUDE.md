# Fridge Assist

Nx monorepo with four apps that help users manage fridge inventory and get recipe suggestions.

## Apps

| App | Path | Stack |
|-----|------|-------|
| **API** | `apps/api` | NestJS + Supabase + Google Gemini |
| **Telegram Bot** | `apps/telegram-bot` | grammy + axios |
| **Web** | `apps/web` | React 18 + Vite + Tailwind + shadcn/ui |
| **Mobile** | `apps/mobile` | Flutter + Riverpod + Supabase + Dio |

## Commands

```bash
npx nx build api              # Build API
npx nx build telegram-bot     # Build bot
npx nx build web              # Build web app
npx nx serve api              # Dev server (http://localhost:3000/api)
npx nx serve telegram-bot     # Dev bot (long polling)
npx nx serve web              # Dev web (http://localhost:4200)
npx nx serve mobile           # Run Flutter app
npx nx build-android mobile   # Build Android APK
npx nx build-ios mobile       # Build iOS (no codesign)
npx nx test mobile            # Run Flutter tests
npx nx test web               # Run web tests (Vitest)
npx nx lint api               # Lint API
npx nx lint telegram-bot      # Lint bot
npx nx lint web               # Lint web
```

## Tech Stack

- **Runtime**: Node 20
- **Package manager**: npm (workspaces)
- **Monorepo**: Nx 22
- **API**: NestJS, Supabase (Postgres), Google Gemini AI, class-validator/class-transformer
- **Bot**: grammy, axios, custom i18n (ua/en)
- **Web**: React 18, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack React Query, Framer Motion
- **Mobile**: Flutter 3.16+, Riverpod, GoRouter, Dio, Supabase Auth, Freezed

## npm Cache Note

If npm commands fail with permission errors, run:
```bash
sudo chown -R $(id -u):$(id -g) ~/.npm
```
Or use `NPM_CONFIG_CACHE=/tmp/npm-cache-fix` as a one-off workaround.
