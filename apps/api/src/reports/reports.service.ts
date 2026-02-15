import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private supabase: SupabaseService) {}

  async create(userId: string, type: 'bug' | 'idea', description: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('reports')
      .insert({ user_id: userId, type, description })
      .select()
      .single();

    if (error) throw error;
    this.logger.log(`Created ${type} report ${data.id} for user ${userId}`);
    return data;
  }
}
