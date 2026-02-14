# Web App Patterns (React + Vite)

## Stack

React 18, Vite, Tailwind CSS, shadcn/ui, React Router, TanStack React Query, Framer Motion, Zod + React Hook Form.

## Structure

```
apps/web/src/
  pages/           — screen-level components (one per route)
  components/      — shared app components (BottomNav, NavLink)
  components/ui/   — shadcn/ui primitives (do not edit manually)
  hooks/           — custom React hooks
  lib/             — utilities (utils.ts with cn() helper)
  data/            — mock data (to be replaced with API calls)
  test/            — test setup
```

## Page Pattern

Each page is a default-exported React component in `pages/`. File names use PascalCase with `Screen` suffix: `FridgeScreen.tsx`, `RecipesScreen.tsx`.

## Routing

React Router v6 in `App.tsx`. Phase-based flow: splash → auth → onboarding → app (with routes). `BottomNav` is rendered for all app routes.

## Path Alias

`@/*` maps to `./src/*` via tsconfig paths, resolved by `nxViteTsPaths()` in `vite.config.ts`.

## shadcn/ui

Config in `components.json`. UI primitives live in `components/ui/`. Add new components via the shadcn CLI. Uses `cn()` helper from `@/lib/utils` for conditional classes.

## Styling

- Tailwind CSS with custom theme in `tailwind.config.ts`
- CSS variables for colors defined in `src/index.css`
- Liquid Glass design — translucent panels with `backdrop-blur`, gradients, rounded corners
- Custom animations: `float`, `pulse-soft`, `accordion-down/up`

## State Management

- Server state: TanStack React Query (`QueryClientProvider` in App)
- Local UI state: React `useState`/`useReducer`
- Forms: React Hook Form + Zod resolvers

## Nx Commands

```bash
npx nx serve web     # Dev server (http://localhost:4200)
npx nx build web     # Production build → dist/apps/web/
npx nx test web      # Vitest
npx nx lint web      # ESLint
```
