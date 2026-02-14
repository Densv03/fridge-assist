# Code Style Conventions

## Naming

- **Files**: kebab-case, suffixed by type — `inventory.service.ts`, `cook.handler.ts`, `create-ingredient.dto.ts`, `user-exists.guard.ts`
- **Classes**: PascalCase — `InventoryService`, `IngestionController`
- **Functions/methods**: camelCase — `findAllForUser`, `formatInventoryList`
- **Constants**: UPPER_SNAKE_CASE — `TTL_MS`, `PREFIX`
- **DB tables/columns**: snake_case — `master_ingredients`, `canonical_name`

## Formatting

- Single quotes, semicolons (Prettier defaults)
- Use `async/await` exclusively — no `.then()` chains

## Imports

Order imports as:
1. External packages (`@nestjs/common`, `grammy`, `axios`)
2. Internal modules (`../common/guards`, `./dto`)
