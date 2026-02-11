import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { IdentityProvider } from '../common/enums/identity-provider.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabase: SupabaseService) {}

  async findAll() {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw new NotFoundException(`User ${id} not found`);
    return data;
  }

  async exists(id: string): Promise<boolean> {
    const client = this.supabase.getClient();
    const { data } = await client
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    return !!data;
  }

  async create(input: {
    provider: IdentityProvider;
    provider_user_id: string;
    email?: string;
    name?: string;
    phone?: string;
    metadata?: Record<string, unknown>;
  }) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    this.logger.log(`Created user ${data.id} (provider: ${input.provider})`);
    return data;
  }

  async update(
    id: string,
    input: {
      email?: string;
      name?: string;
      avatar_url?: string;
      phone?: string;
      metadata?: Record<string, unknown>;
      preferred_language?: string;
    },
  ) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('users')
      .update(input)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new NotFoundException(`User ${id} not found`);
    return data;
  }

  async remove(id: string) {
    const client = this.supabase.getClient();
    const { error } = await client.from('users').delete().eq('id', id);

    if (error) throw error;
    this.logger.log(`Deleted user ${id}`);
    return { deleted: true };
  }

  async resolveByProvider(input: {
    provider: IdentityProvider;
    provider_user_id: string;
    name?: string;
    email?: string;
    avatar_url?: string;
    phone?: string;
    metadata?: Record<string, unknown>;
  }) {
    const client = this.supabase.getClient();

    const { data: existing } = await client
      .from('users')
      .select('*')
      .eq('provider', input.provider)
      .eq('provider_user_id', input.provider_user_id)
      .single();

    const isExisting = !!existing;

    if (existing) {
      const updates: Record<string, unknown> = {};
      if (input.name !== undefined) updates.name = input.name;
      if (input.email !== undefined) updates.email = input.email;
      if (input.avatar_url !== undefined) updates.avatar_url = input.avatar_url;
      if (input.phone !== undefined) updates.phone = input.phone;
      if (input.metadata !== undefined) updates.metadata = input.metadata;

      if (Object.keys(updates).length === 0) {
        this.logger.log(
          `Resolved user ${existing.id} (provider: ${input.provider}, existing: ${isExisting})`,
        );
        return existing;
      }

      const { data, error } = await client
        .from('users')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single();

      if (error) throw error;
      this.logger.log(
        `Resolved user ${data.id} (provider: ${input.provider}, existing: ${isExisting})`,
      );
      return data;
    }

    const { data, error } = await client
      .from('users')
      .insert(input)
      .select()
      .single();

    if (error) throw error;
    this.logger.log(
      `Resolved user ${data.id} (provider: ${input.provider}, existing: ${isExisting})`,
    );
    return data;
  }
}
