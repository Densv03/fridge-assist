import { Injectable, Logger } from '@nestjs/common';
import { ExtractionService } from '../extraction/extraction.service';
import { NormalizationService } from '../normalization/normalization.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  TransactionsService,
  LogTransactionInput,
} from '../transactions/transactions.service';
import { LogsService } from '../logs/logs.service';
import { ActionType } from '../common/enums/action-type.enum';
import { InputType } from '../common/enums/input-type.enum';
import { ExtractionResult } from '../extraction/interfaces/extraction-result.interface';
import { ProcessResult } from './dto/process-result.dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private extraction: ExtractionService,
    private normalization: NormalizationService,
    private inventory: InventoryService,
    private transactions: TransactionsService,
    private logs: LogsService,
  ) {}

  async processText(
    userId: string,
    text: string,
    source: string,
  ): Promise<ProcessResult> {
    this.logger.log(`Processing text input for user ${userId}`);
    await this.logs.create({
      userId,
      inputType: InputType.TEXT,
      content: text,
    });
    const extracted = await this.extraction.extractFromText(text);
    return this.processExtraction(userId, extracted, source, text);
  }

  async processImage(
    userId: string,
    buffer: Buffer,
    mimeType: string,
    fileName?: string,
  ): Promise<ProcessResult> {
    this.logger.log(`Processing image (mime: ${mimeType}) for user ${userId}`);
    await this.logs.create({
      userId,
      inputType: InputType.FILE,
      mimeType,
      fileName,
    });
    const extracted = await this.extraction.extractFromImage(buffer, mimeType);
    return this.processExtraction(userId, extracted, 'image', null);
  }

  async processAudio(
    userId: string,
    buffer: Buffer,
    mimeType: string,
    fileName?: string,
  ): Promise<ProcessResult> {
    this.logger.log(`Processing audio (mime: ${mimeType}) for user ${userId}`);
    await this.logs.create({
      userId,
      inputType: InputType.AUDIO,
      mimeType,
      fileName,
    });
    const extracted = await this.extraction.extractFromAudio(buffer, mimeType);
    return this.processExtraction(userId, extracted, 'audio', null);
  }

  private async processExtraction(
    userId: string,
    extracted: ExtractionResult,
    source: string,
    rawInput: string | null,
  ): Promise<ProcessResult> {
    if (extracted.intent === 'CLEAR_ALL') {
      const count = await this.inventory.clearAll(userId);
      return {
        status: 'completed',
        processed_items: [],
        clarifications: [],
        transaction_ids: [],
        cleared_count: count,
      };
    }

    const normalized = await this.normalization.normalize(extracted.items);
    const action = extracted.intent as ActionType;

    const processedItems: ProcessResult['processed_items'] = [];
    const transactionIds: string[] = [];

    // Process matched + auto-created items
    const allMatched = [...normalized.matched, ...normalized.created];
    for (const item of allMatched) {
      const quantityChange =
        action === ActionType.ADD ? item.quantity : -item.quantity;

      const inventoryItem = await this.inventory.adjustQuantity(
        userId,
        item.ingredient_id,
        quantityChange,
        item.unit,
      );

      const txInput: LogTransactionInput = {
        userId,
        ingredientId: item.ingredient_id,
        action,
        quantityChange: item.quantity,
        unit: item.unit,
        source,
        rawInput,
      };
      const tx = await this.transactions.log(txInput);
      transactionIds.push(tx.id);

      processedItems.push({
        raw_name: item.name,
        canonical_name: item.canonical_name,
        canonical_name_ua: item.canonical_name_ua,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit: item.unit,
        action,
      });
    }

    // Build clarifications from ambiguous items
    const clarifications = normalized.ambiguous.map((item) => ({
      raw_name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      candidates: item.candidates.map((c) => ({
        id: c.id,
        canonical_name: c.canonical_name,
        canonical_name_ua: c.canonical_name_ua,
      })),
    }));

    this.logger.log(
      `Processed ${processedItems.length} items (action: ${action}) for user ${userId}`,
    );

    return {
      status: clarifications.length > 0 ? 'needs_clarification' : 'completed',
      processed_items: processedItems,
      clarifications,
      transaction_ids: transactionIds,
    };
  }
}
