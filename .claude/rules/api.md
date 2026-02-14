---
path: apps/api/**
---

# NestJS API Patterns

## Feature Module Structure

Each feature lives in its own directory with:
- `*.module.ts` — NestJS module (imports, controllers, providers, exports)
- `*.controller.ts` — route handlers
- `*.service.ts` — business logic + Supabase queries
- `dto/` — request validation classes

Register new modules in `app.module.ts` (import order: config → infrastructure → core → features).

## Supabase Usage

Services inject `SupabaseService` and call `this.supabase.getClient()`:

```typescript
@Injectable()
export class ExampleService {
  constructor(private supabase: SupabaseService) {}

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client.from('table').select('*');
    if (error) throw error;
    return data;
  }
}
```

## Authentication

- `@UseGuards(UserExistsGuard)` on controllers that require an authenticated user
- `@UserId() userId: string` param decorator extracts `x-user-id` header
- The guard validates the user exists in the DB before the handler runs

## DTOs & Validation

Use class-validator decorators: `@IsString()`, `@IsNotEmpty()`, `@IsOptional()`, `@IsEnum()`, `@IsArray()`, `@IsIn([...])`.

Global `ValidationPipe` is configured with `whitelist: true` and `transform: true` — no manual pipe setup needed per route.

## Error Handling

Throw NestJS built-in exceptions:
- `NotFoundException` — resource not found
- `BadRequestException` — invalid input or state
- `UnauthorizedException` — auth failures
- `GoneException` — expired resources

## Environment Variables

Env vars are validated via class-validator in `apps/api/src/config/env.validation.ts`. Add new required vars there.
