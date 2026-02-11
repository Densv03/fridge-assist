import {
  Injectable,
  Logger,
  BadRequestException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { ExtractionService } from '../extraction/extraction.service';
import { NormalizationService } from '../normalization/normalization.service';
import { InventoryService } from '../inventory/inventory.service';
import {
  TransactionsService,
  LogTransactionInput,
} from '../transactions/transactions.service';
import { LogsService } from '../logs/logs.service';
import { SupabaseService } from '../supabase/supabase.service';
import { ActionType } from '../common/enums/action-type.enum';
import { InputType } from '../common/enums/input-type.enum';
import { ExtractionResult } from '../extraction/interfaces/extraction-result.interface';
import { ProcessResult } from './dto/process-result.dto';
import {
  ExtractionPreview,
  PreviewItem,
  PreviewClarification,
} from './dto/extraction-preview.dto';

@Injectable()
export class IngestionService {
  private readonly logger = new Logger(IngestionService.name);

  constructor(
    private extraction: ExtractionService,
    private normalization: NormalizationService,
    private inventory: InventoryService,
    private transactions: TransactionsService,
    private logs: LogsService,
    private supabase: SupabaseService,
  ) {}

  // ── Existing process methods (backward compatible) ──

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

  // ── Preview methods ──

  async previewText(
    userId: string,
    text: string,
    source: string,
  ): Promise<ExtractionPreview> {
    this.logger.log(`Preview text input for user ${userId}`);
    await this.logs.create({
      userId,
      inputType: InputType.TEXT,
      content: text,
    });
    const extracted = await this.extraction.extractFromText(text);
    return this.createPreview(userId, extracted, source, text);
  }

  async previewImage(
    userId: string,
    buffer: Buffer,
    mimeType: string,
    fileName?: string,
  ): Promise<ExtractionPreview> {
    this.logger.log(
      `Preview image (mime: ${mimeType}) for user ${userId}`,
    );
    await this.logs.create({
      userId,
      inputType: InputType.FILE,
      mimeType,
      fileName,
    });
    const extracted = await this.extraction.extractFromImage(buffer, mimeType);
    return this.createPreview(userId, extracted, 'image', null);
  }

  async previewAudio(
    userId: string,
    buffer: Buffer,
    mimeType: string,
    fileName?: string,
  ): Promise<ExtractionPreview> {
    this.logger.log(
      `Preview audio (mime: ${mimeType}) for user ${userId}`,
    );
    await this.logs.create({
      userId,
      inputType: InputType.AUDIO,
      mimeType,
      fileName,
    });
    const extracted = await this.extraction.extractFromAudio(buffer, mimeType);
    return this.createPreview(userId, extracted, 'audio', null);
  }

  private async createPreview(
    userId: string,
    extracted: ExtractionResult,
    source: string,
    rawInput: string | null,
  ): Promise<ExtractionPreview> {
    // CLEAR_ALL — process immediately, no preview needed
    if (extracted.intent === 'CLEAR_ALL') {
      const count = await this.inventory.clearAll(userId);
      return {
        preview_id: '',
        intent: 'CLEAR_ALL',
        items: [],
        clarifications: [],
        cleared_count: count,
      };
    }

    const normalized = await this.normalization.normalize(extracted.items);
    const client = this.supabase.getClient();

    // Insert preview header
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .insert({
        user_id: userId,
        intent: extracted.intent,
        source,
        raw_input: rawInput,
        status: 'pending',
      })
      .select('id')
      .single();

    if (previewError) throw previewError;

    // Build preview item rows
    const itemRows: Array<{
      preview_id: string;
      raw_name: string;
      canonical_name: string | null;
      canonical_name_ua: string | null;
      ingredient_id: string | null;
      quantity: number;
      unit: string;
      status: string;
      candidates: unknown;
      confidence: number | null;
    }> = [];

    const allMatched = [...normalized.matched, ...normalized.created];
    for (const item of allMatched) {
      itemRows.push({
        preview_id: preview.id,
        raw_name: item.name,
        canonical_name: item.canonical_name,
        canonical_name_ua: item.canonical_name_ua ?? null,
        ingredient_id: item.ingredient_id,
        quantity: item.quantity,
        unit: item.unit,
        status: 'matched',
        candidates: [],
        confidence: item.similarity,
      });
    }

    for (const item of normalized.ambiguous) {
      itemRows.push({
        preview_id: preview.id,
        raw_name: item.name,
        canonical_name: null,
        canonical_name_ua: null,
        ingredient_id: null,
        quantity: item.quantity,
        unit: item.unit,
        status: 'ambiguous',
        candidates: item.candidates.map((c) => ({
          id: c.id,
          canonical_name: c.canonical_name,
          canonical_name_ua: c.canonical_name_ua,
        })),
        confidence: null,
      });
    }

    if (itemRows.length > 0) {
      const { error: itemsError } = await client
        .from('extraction_preview_items')
        .insert(itemRows);
      if (itemsError) throw itemsError;
    }

    return this.loadPreview(userId, preview.id);
  }

  async confirmPreview(
    userId: string,
    previewId: string,
  ): Promise<ProcessResult> {
    const client = this.supabase.getClient();

    // Load preview
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('*')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Load items
    const { data: items, error: itemsError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('preview_id', previewId);

    if (itemsError) throw itemsError;

    const action = preview.intent as ActionType;
    const processedItems: ProcessResult['processed_items'] = [];
    const transactionIds: string[] = [];

    for (const item of items ?? []) {
      let ingredientId = item.ingredient_id;
      let canonicalName = item.canonical_name;
      let canonicalNameUa = item.canonical_name_ua;

      // Auto-create master_ingredient for unresolved ambiguous items
      if (item.status === 'ambiguous' || !ingredientId) {
        const created = await this.normalization.createMasterIngredient({
          name: item.raw_name,
          name_ua: item.raw_name,
          quantity: item.quantity,
          unit: item.unit,
          category: 'Other',
        });
        if (!created) {
          this.logger.warn(
            `Failed to auto-create ingredient for "${item.raw_name}", skipping`,
          );
          continue;
        }
        ingredientId = created.id;
        canonicalName = created.canonical_name;
        canonicalNameUa = created.canonical_name_ua;
      }

      const quantityChange =
        action === ActionType.ADD ? item.quantity : -item.quantity;

      await this.inventory.adjustQuantity(
        userId,
        ingredientId,
        quantityChange,
        item.unit,
      );

      const txInput: LogTransactionInput = {
        userId,
        ingredientId,
        action,
        quantityChange: item.quantity,
        unit: item.unit,
        source: preview.source,
        rawInput: preview.raw_input,
      };
      const tx = await this.transactions.log(txInput);
      transactionIds.push(tx.id);

      processedItems.push({
        raw_name: item.raw_name,
        canonical_name: canonicalName,
        canonical_name_ua: canonicalNameUa,
        ingredient_id: ingredientId,
        quantity: Number(item.quantity),
        unit: item.unit,
        action,
      });
    }

    // Mark preview as confirmed
    await client
      .from('extraction_previews')
      .update({ status: 'confirmed' })
      .eq('id', previewId);

    this.logger.log(
      `Confirmed preview ${previewId}: ${processedItems.length} items for user ${userId}`,
    );

    return {
      status: 'completed',
      processed_items: processedItems,
      clarifications: [],
      transaction_ids: transactionIds,
    };
  }

  async cancelPreview(userId: string, previewId: string): Promise<void> {
    const client = this.supabase.getClient();

    const { data: preview, error } = await client
      .from('extraction_previews')
      .select('id, user_id, status')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (error || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }

    await client
      .from('extraction_previews')
      .update({ status: 'cancelled' })
      .eq('id', previewId);

    this.logger.log(`Cancelled preview ${previewId} for user ${userId}`);
  }

  async removePreviewItem(
    userId: string,
    previewId: string,
    itemId: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    // Validate ownership
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('id, user_id, status, expires_at')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Delete the item
    const { error: deleteError } = await client
      .from('extraction_preview_items')
      .delete()
      .eq('id', itemId)
      .eq('preview_id', previewId);

    if (deleteError) throw deleteError;

    // Check if items remain
    const { count } = await client
      .from('extraction_preview_items')
      .select('id', { count: 'exact', head: true })
      .eq('preview_id', previewId);

    if (count === 0) {
      // Auto-cancel if no items remain
      await client
        .from('extraction_previews')
        .update({ status: 'cancelled' })
        .eq('id', previewId);

      return {
        preview_id: previewId,
        intent: '',
        items: [],
        clarifications: [],
      };
    }

    return this.loadPreview(userId, previewId);
  }

  async resolveAmbiguous(
    userId: string,
    previewId: string,
    itemId: string,
    ingredientId: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    // Validate ownership
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('id, user_id, status, expires_at')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Load the item to find the candidate
    const { data: item, error: itemError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('id', itemId)
      .eq('preview_id', previewId)
      .single();

    if (itemError || !item) {
      throw new NotFoundException('Preview item not found');
    }

    const candidates = (item.candidates ?? []) as Array<{
      id: string;
      canonical_name: string;
      canonical_name_ua?: string;
    }>;
    const candidate = candidates.find((c) => c.id === ingredientId);
    if (!candidate) {
      throw new BadRequestException('Candidate not found in item candidates');
    }

    // Update the item
    const { error: updateError } = await client
      .from('extraction_preview_items')
      .update({
        status: 'matched',
        ingredient_id: ingredientId,
        canonical_name: candidate.canonical_name,
        canonical_name_ua: candidate.canonical_name_ua ?? null,
      })
      .eq('id', itemId);

    if (updateError) throw updateError;

    return this.loadPreview(userId, previewId);
  }

  async addCustomItem(
    userId: string,
    previewId: string,
    itemId: string,
    name: string,
    nameUa?: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    // Validate ownership
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('id, user_id, status, expires_at')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Load the item to get quantity/unit
    const { data: item, error: itemError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('id', itemId)
      .eq('preview_id', previewId)
      .single();

    if (itemError || !item) {
      throw new NotFoundException('Preview item not found');
    }

    // Create master ingredient
    const created = await this.normalization.createMasterIngredient({
      name,
      name_ua: nameUa ?? name,
      quantity: item.quantity,
      unit: item.unit,
      category: 'Other',
    });

    if (!created) {
      throw new BadRequestException('Failed to create custom ingredient');
    }

    // Update the item
    const { error: updateError } = await client
      .from('extraction_preview_items')
      .update({
        status: 'matched',
        ingredient_id: created.id,
        canonical_name: created.canonical_name,
        canonical_name_ua: created.canonical_name_ua ?? null,
      })
      .eq('id', itemId);

    if (updateError) throw updateError;

    return this.loadPreview(userId, previewId);
  }

  async replacePreviewItem(
    userId: string,
    previewId: string,
    itemId: string,
    name: string,
    nameUa?: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    // Validate ownership + pending + not expired
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('id, user_id, status, expires_at')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Load the item to get quantity/unit
    const { data: item, error: itemError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('id', itemId)
      .eq('preview_id', previewId)
      .single();

    if (itemError || !item) {
      throw new NotFoundException('Preview item not found');
    }

    // Normalize the new name using existing item's quantity/unit
    const normalized = await this.normalization.normalize([
      { name, name_ua: nameUa ?? name, quantity: item.quantity, unit: item.unit, category: 'Other' },
    ]);

    const allMatched = [...normalized.matched, ...normalized.created];

    if (allMatched.length === 1) {
      // Single match — replace directly
      const match = allMatched[0];
      const { error: updateError } = await client
        .from('extraction_preview_items')
        .update({
          raw_name: name,
          status: 'matched',
          ingredient_id: match.ingredient_id,
          canonical_name: match.canonical_name,
          canonical_name_ua: match.canonical_name_ua ?? null,
          candidates: [],
          confidence: match.similarity,
        })
        .eq('id', itemId);

      if (updateError) throw updateError;
    } else if (normalized.ambiguous.length === 1) {
      // Ambiguous — set candidates
      const amb = normalized.ambiguous[0];
      const { error: updateError } = await client
        .from('extraction_preview_items')
        .update({
          raw_name: name,
          status: 'ambiguous',
          ingredient_id: null,
          canonical_name: null,
          canonical_name_ua: null,
          candidates: amb.candidates.map((c) => ({
            id: c.id,
            canonical_name: c.canonical_name,
            canonical_name_ua: c.canonical_name_ua,
          })),
        })
        .eq('id', itemId);

      if (updateError) throw updateError;
    } else {
      // No match at all — auto-create
      const created = await this.normalization.createMasterIngredient({
        name,
        name_ua: nameUa ?? name,
        quantity: item.quantity,
        unit: item.unit,
        category: 'Other',
      });

      if (!created) {
        throw new BadRequestException('Failed to create ingredient for replacement');
      }

      const { error: updateError } = await client
        .from('extraction_preview_items')
        .update({
          raw_name: name,
          status: 'matched',
          ingredient_id: created.id,
          canonical_name: created.canonical_name,
          canonical_name_ua: created.canonical_name_ua ?? null,
          candidates: [],
        })
        .eq('id', itemId);

      if (updateError) throw updateError;
    }

    return this.loadPreview(userId, previewId);
  }

  async changePreviewItemAmount(
    userId: string,
    previewId: string,
    itemId: string,
    text: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    // Validate ownership + pending + not expired
    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('id, user_id, status, expires_at')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }
    if (preview.status !== 'pending') {
      throw new BadRequestException(`Preview already ${preview.status}`);
    }
    if (new Date(preview.expires_at) < new Date()) {
      throw new GoneException('Preview has expired');
    }

    // Load the item to get currentUnit
    const { data: item, error: itemError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('id', itemId)
      .eq('preview_id', previewId)
      .single();

    if (itemError || !item) {
      throw new NotFoundException('Preview item not found');
    }

    // Parse quantity using AI
    const parsed = await this.extraction.parseQuantity(text, item.unit);

    if (!parsed.valid) {
      throw new BadRequestException('Invalid quantity input');
    }

    // Update item's quantity and unit
    const { error: updateError } = await client
      .from('extraction_preview_items')
      .update({
        quantity: parsed.quantity,
        unit: parsed.unit,
      })
      .eq('id', itemId);

    if (updateError) throw updateError;

    return this.loadPreview(userId, previewId);
  }

  private async loadPreview(
    userId: string,
    previewId: string,
  ): Promise<ExtractionPreview> {
    const client = this.supabase.getClient();

    const { data: preview, error: previewError } = await client
      .from('extraction_previews')
      .select('*')
      .eq('id', previewId)
      .eq('user_id', userId)
      .single();

    if (previewError || !preview) {
      throw new NotFoundException('Preview not found');
    }

    const { data: rows, error: rowsError } = await client
      .from('extraction_preview_items')
      .select('*')
      .eq('preview_id', previewId)
      .order('created_at', { ascending: true });

    if (rowsError) throw rowsError;

    const items: PreviewItem[] = [];
    const clarifications: PreviewClarification[] = [];

    for (const row of rows ?? []) {
      if (row.status === 'matched' && row.ingredient_id) {
        items.push({
          id: row.id,
          raw_name: row.raw_name,
          canonical_name: row.canonical_name,
          canonical_name_ua: row.canonical_name_ua,
          ingredient_id: row.ingredient_id,
          quantity: Number(row.quantity),
          unit: row.unit,
          confidence: row.confidence ?? 1.0,
        });
      } else {
        clarifications.push({
          id: row.id,
          raw_name: row.raw_name,
          quantity: Number(row.quantity),
          unit: row.unit,
          candidates: (row.candidates ?? []) as PreviewClarification['candidates'],
        });
      }
    }

    return {
      preview_id: preview.id,
      intent: preview.intent,
      items,
      clarifications,
    };
  }
}
