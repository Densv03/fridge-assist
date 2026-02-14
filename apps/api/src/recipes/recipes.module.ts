import { Module } from '@nestjs/common';
import { InventoryModule } from '../inventory/inventory.module';
import { IngredientsModule } from '../ingredients/ingredients.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CookingHistoryService } from './cooking-history.service';

@Module({
  imports: [InventoryModule, IngredientsModule, TransactionsModule],
  controllers: [RecipesController],
  providers: [RecipesService, CookingHistoryService],
})
export class RecipesModule {}
