import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { InputType } from '../common/enums/input-type.enum';

export interface CreateLogInput {
  userId: string;
  inputType: InputType;
  content?: string;
  fileName?: string;
  mimeType?: string;
}

@Injectable()
export class LogsService {
  private readonly logger = new Logger(LogsService.name);

  constructor(private supabase: SupabaseService) {}

  async create(input: CreateLogInput) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('logs')
      .insert({
        user_id: input.userId,
        input_type: input.inputType,
        content: input.content ?? null,
        file_name: input.fileName ?? null,
        mime_type: input.mimeType ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    this.logger.log(`Logged ${input.inputType} input for user ${input.userId}`);
    return data;
  }

  async findByUser(userId: string) {
    const client = this.supabase.getClient();
    const { data, error } = await client
      .from('logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
