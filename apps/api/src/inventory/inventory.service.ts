import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { InventoryStatus } from '../common/enums/inventory-status.enum';

@Injectable()
export class InventoryService {
  private readonly logger = new Logger(InventoryService.name);

  constructor(private supabase: SupabaseService) {}

  async findAllForUser(userId: string, status?: InventoryStatus) {
    const client = this.supabase.getClient();
    let query = client
      .from('user_inventory')
      .select('*, master_ingredients(canonical_name, canonical_name_ua, category, default_unit)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string, userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('user_inventory')
      .select('*, master_ingredients(canonical_name, canonical_name_ua, category, default_unit)')
      .eq('id', id)
      .eq('user_id', userId)
      .single();

    if (error) throw new NotFoundException(`Inventory item ${id} not found`);
    return data;
  }

  async adjustQuantity(
    userId: string,
    ingredientId: string,
    quantityChange: number,
    unit: string,
  ) {
    const client = this.supabase.getClient();

    // Try to find existing inventory row
    const { data: existing } = await client
      .from('user_inventory')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('ingredient_id', ingredientId)
      .single();

    let newQuantity: number;

    if (existing) {
      newQuantity = Math.max(0, Number(existing.quantity) + quantityChange);

      if (newQuantity <= 0) {
        const { error } = await client
          .from('user_inventory')
          .delete()
          .eq('id', existing.id);
        if (error) throw error;
        this.logger.log(
          `Removed inventory ${existing.id} (quantity reached 0) for user ${userId}`,
        );
        return { id: existing.id, quantity: 0, unit, status: 'Out of Stock' };
      }

      const newStatus = this.computeStatus(newQuantity);

      const { data, error } = await client
        .from('user_inventory')
        .update({ quantity: newQuantity, unit, status: newStatus })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      this.logger.log(
        `Adjusted inventory ${existing.id} by ${quantityChange} ${unit} for user ${userId}`,
      );
      return data;
    } else {
      newQuantity = Math.max(0, quantityChange);
      const newStatus = this.computeStatus(newQuantity);

      const { data, error } = await client
        .from('user_inventory')
        .insert({
          user_id: userId,
          ingredient_id: ingredientId,
          quantity: newQuantity,
          unit,
          status: newStatus,
        })
        .select()
        .single();

      if (error) throw error;
      this.logger.log(
        `Adjusted inventory ${data.id} by ${quantityChange} ${unit} for user ${userId}`,
      );
      return data;
    }
  }

  async update(
    id: string,
    userId: string,
    updates: { quantity?: number; unit?: string; expires_at?: string },
  ) {
    const client = this.supabase.getClient();

    const patch: Record<string, unknown> = {};
    if (updates.quantity !== undefined) {
      patch.quantity = updates.quantity;
      patch.status = this.computeStatus(updates.quantity);
    }
    if (updates.unit !== undefined) patch.unit = updates.unit;
    if (updates.expires_at !== undefined) patch.expires_at = updates.expires_at;

    const { data, error } = await client
      .from('user_inventory')
      .update(patch)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw new NotFoundException(`Inventory item ${id} not found`);
    return data;
  }

  async clearAll(userId: string): Promise<number> {
    const client = this.supabase.getClient();

    const { data: items } = await client
      .from('user_inventory')
      .select('id')
      .eq('user_id', userId);

    const count = items?.length ?? 0;
    if (count === 0) return 0;

    const { error } = await client
      .from('user_inventory')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
    this.logger.log(`Cleared all ${count} inventory items for user ${userId}`);
    return count;
  }

  async remove(id: string, userId: string) {
    const client = this.supabase.getClient();
    const { error } = await client
      .from('user_inventory')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    this.logger.log(`Removed inventory item ${id} for user ${userId}`);
    return { deleted: true };
  }

  private computeStatus(quantity: number): InventoryStatus {
    if (quantity <= 0) return InventoryStatus.OUT_OF_STOCK;
    if (quantity <= 2) return InventoryStatus.LOW_STOCK;
    return InventoryStatus.IN_STOCK;
  }
}
