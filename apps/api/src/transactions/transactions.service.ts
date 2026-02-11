import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ActionType } from '../common/enums/action-type.enum';

export interface LogTransactionInput {
  userId: string;
  ingredientId: string;
  action: ActionType;
  quantityChange: number;
  unit: string;
  source?: string;
  rawInput?: string;
  notes?: string;
}

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(private supabase: SupabaseService) {}

  async log(input: LogTransactionInput) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('transactions')
      .insert({
        user_id: input.userId,
        ingredient_id: input.ingredientId,
        action: input.action,
        quantity_change: input.quantityChange,
        unit: input.unit,
        source: input.source,
        raw_input: input.rawInput,
        notes: input.notes,
      })
      .select()
      .single();

    if (error) throw error;
    this.logger.log(
      `Transaction ${input.action} ${input.quantityChange} ${input.unit} of ${input.ingredientId} for user ${input.userId}`,
    );
    return data;
  }

  async getHistory(
    userId: string,
    options: { action?: ActionType; limit?: number; offset?: number } = {},
  ) {
    const client = this.supabase.getClient();
    const { limit = 50, offset = 0, action } = options;

    let query = client
      .from('transactions')
      .select('*, master_ingredients(canonical_name)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (action) {
      query = query.eq('action', action);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('transactions')
      .select('*, master_ingredients(canonical_name)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw new NotFoundException(`Transaction ${id} not found`);
    return data;
  }
}
