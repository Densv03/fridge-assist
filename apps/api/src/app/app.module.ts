import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validate } from '../config/env.validation';
import { SupabaseModule } from '../supabase/supabase.module';
import { GeminiModule } from '../gemini/gemini.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { InventoryModule } from '../inventory/inventory.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { IngestionModule } from '../ingestion/ingestion.module';
import { UsersModule } from '../users/users.module';
import { LogsModule } from '../logs/logs.module';
import { RecipesModule } from '../recipes/recipes.module';
import { AuthModule } from '../auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    SupabaseModule,
    GeminiModule,
    UsersModule,
    AuthModule,
    LogsModule,
    IngredientsModule,
    InventoryModule,
    TransactionsModule,
    IngestionModule,
    RecipesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
