import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { InventoryStatus } from '../common/enums/inventory-status.enum';
import {
  areUnitsCompatible,
  convertQuantity,
} from '../common/utils/unit-conversion';

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

    // Query ALL rows for this user + ingredient
    const { data: rows } = await client
      .from('user_inventory')
      .select('id, quantity, unit')
      .eq('user_id', userId)
      .eq('ingredient_id', ingredientId);

    // Find a row with a compatible unit group
    const compatibleRow = (rows ?? []).find((r) =>
      areUnitsCompatible(r.unit, unit),
    );

    if (compatibleRow) {
      // Convert incoming quantity to stored unit
      const converted = convertQuantity(quantityChange, unit, compatibleRow.unit);
      const delta = converted ?? quantityChange;
      const newQuantity = Math.max(0, Number(compatibleRow.quantity) + delta);

      if (newQuantity <= 0) {
        const { error } = await client
          .from('user_inventory')
          .delete()
          .eq('id', compatibleRow.id);
        if (error) throw error;
        this.logger.log(
          `Removed inventory ${compatibleRow.id} (quantity reached 0) for user ${userId}`,
        );
        return { id: compatibleRow.id, quantity: 0, unit: compatibleRow.unit, status: 'Out of Stock' };
      }

      const newStatus = this.computeStatus(newQuantity);

      const { data, error } = await client
        .from('user_inventory')
        .update({ quantity: newQuantity, status: newStatus })
        .eq('id', compatibleRow.id)
        .select()
        .single();

      if (error) throw error;
      this.logger.log(
        `Adjusted inventory ${compatibleRow.id} by ${quantityChange} ${unit} (stored as ${compatibleRow.unit}) for user ${userId}`,
      );
      return data;
    } else {
      // No compatible row — insert new row with the incoming unit
      const newQuantity = Math.max(0, quantityChange);
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
        `Created new inventory ${data.id} with ${quantityChange} ${unit} for user ${userId}`,
      );
      return data;
    }
  }

  async setQuantity(
    userId: string,
    ingredientId: string,
    absoluteQuantity: number,
    unit: string,
  ) {
    const client = this.supabase.getClient();

    const { data: rows } = await client
      .from('user_inventory')
      .select('id, quantity, unit')
      .eq('user_id', userId)
      .eq('ingredient_id', ingredientId);

    if (absoluteQuantity <= 0) {
      // Delete all rows for this ingredient
      if (rows && rows.length > 0) {
        const { error } = await client
          .from('user_inventory')
          .delete()
          .eq('user_id', userId)
          .eq('ingredient_id', ingredientId);
        if (error) throw error;
        this.logger.log(
          `SET: removed all inventory for ingredient ${ingredientId}, user ${userId} (quantity <= 0)`,
        );
      }
      return { id: '', quantity: 0, unit, status: 'Out of Stock' };
    }

    if (rows && rows.length > 0) {
      // Update first row, delete extras
      const first = rows[0];
      const extras = rows.slice(1);

      if (extras.length > 0) {
        const { error } = await client
          .from('user_inventory')
          .delete()
          .in('id', extras.map((r) => r.id));
        if (error) throw error;
      }

      const newStatus = this.computeStatus(absoluteQuantity);
      const { data, error } = await client
        .from('user_inventory')
        .update({ quantity: absoluteQuantity, unit, status: newStatus })
        .eq('id', first.id)
        .select()
        .single();

      if (error) throw error;
      this.logger.log(
        `SET: updated inventory ${first.id} to ${absoluteQuantity} ${unit} for user ${userId}`,
      );
      return data;
    }

    // No existing rows — insert new
    const newStatus = this.computeStatus(absoluteQuantity);
    const { data, error } = await client
      .from('user_inventory')
      .insert({
        user_id: userId,
        ingredient_id: ingredientId,
        quantity: absoluteQuantity,
        unit,
        status: newStatus,
      })
      .select()
      .single();

    if (error) throw error;
    this.logger.log(
      `SET: created inventory ${data.id} with ${absoluteQuantity} ${unit} for user ${userId}`,
    );
    return data;
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
