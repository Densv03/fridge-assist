import { Module } from '@nestjs/common';
import { ExtractionModule } from '../extraction/extraction.module';
import { NormalizationModule } from '../normalization/normalization.module';
import { InventoryModule } from '../inventory/inventory.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

@Module({
  imports: [
    ExtractionModule,
    NormalizationModule,
    InventoryModule,
    TransactionsModule,
  ],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
