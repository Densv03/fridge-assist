import { Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';

@Injectable()
export class IngredientsService {
  constructor(private supabase: SupabaseService) {}

  async findAll(search?: string) {
    const client = this.supabase.getClient();

    if (search) {
      return this.searchFuzzy(search);
    }

    const { data, error } = await client
      .from('master_ingredients')
      .select('*')
      .order('canonical_name');

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('master_ingredients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`Ingredient ${id} not found`);
    return data;
  }

  async create(dto: CreateIngredientDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('master_ingredients')
      .insert(dto)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, dto: UpdateIngredientDto) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('master_ingredients')
      .update(dto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException(`Ingredient ${id} not found`);
    return data;
  }

  async remove(id: string) {
    const client = this.supabase.getClient();
    const { error } = await client
      .from('master_ingredients')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { deleted: true };
  }

  async searchFuzzy(term: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client.rpc('search_ingredients', {
      search_term: term,
    });

    if (error) {
      // Fallback to ilike if RPC not available
      const { data: fallback, error: fallbackError } = await client
        .from('master_ingredients')
        .select('*')
        .ilike('canonical_name', `%${term}%`)
        .order('canonical_name')
        .limit(20);
      if (fallbackError) throw fallbackError;
      return fallback;
    }
    return data;
  }
}
