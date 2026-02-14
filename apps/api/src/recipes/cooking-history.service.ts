import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class CookingHistoryService {
  private readonly logger = new Logger(CookingHistoryService.name);

  constructor(private supabase: SupabaseService) {}

  async log(
    userId: string,
    dishNameEn: string,
    dishNameUa: string,
    category?: string,
  ) {
    const client = this.supabase.getClient();
    const { error } = await client.from('cooking_history').insert({
      user_id: userId,
      dish_name_en: dishNameEn,
      dish_name_ua: dishNameUa,
      category,
    });

    if (error) throw error;
    this.logger.log(`Logged cooking history: ${dishNameEn} for user ${userId}`);
  }

  async getRecent(userId: string, limit = 30) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('cooking_history')
      .select('dish_name_en, dish_name_ua, category, cooked_at')
      .eq('user_id', userId)
      .order('cooked_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  }
}
