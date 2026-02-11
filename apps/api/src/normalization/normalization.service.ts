import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ExtractedItem } from '../extraction/interfaces/extraction-result.interface';

interface MatchedItem extends ExtractedItem {
  ingredient_id: string;
  canonical_name: string;
  canonical_name_ua?: string;
}

interface AmbiguousItem extends ExtractedItem {
  candidates: {
    id: string;
    canonical_name: string;
    canonical_name_ua?: string;
    similarity: number;
  }[];
}

export interface NormalizationResult {
  matched: MatchedItem[];
  ambiguous: AmbiguousItem[];
  unmatched: ExtractedItem[];
  created: MatchedItem[];
}

@Injectable()
export class NormalizationService {
  private readonly logger = new Logger(NormalizationService.name);

  constructor(private supabase: SupabaseService) {}

  async normalize(items: ExtractedItem[]): Promise<NormalizationResult> {
    const result: NormalizationResult = {
      matched: [],
      ambiguous: [],
      unmatched: [],
      created: [],
    };

    for (const item of items) {
      const candidates = await this.findCandidates(item.name);

      if (candidates.length === 0) {
        // Auto-create new ingredient with Ukrainian name from extraction
        const created = await this.createMasterIngredient(item);
        if (created) {
          result.created.push({
            ...item,
            ingredient_id: created.id,
            canonical_name: created.canonical_name,
            canonical_name_ua: created.canonical_name_ua ?? item.name_ua,
          });
        } else {
          result.unmatched.push(item);
        }
      } else if (
        candidates.length === 1 ||
        candidates[0].similarity > 0.6 ||
        (candidates[0].similarity > 0.3 &&
          candidates[0].similarity - (candidates[1]?.similarity ?? 0) > 0.15)
      ) {
        // Clear single match — backfill Ukrainian name if missing
        if (!candidates[0].canonical_name_ua && item.name_ua) {
          await this.updateUkrainianName(candidates[0].id, item.name_ua);
          candidates[0].canonical_name_ua = item.name_ua;
        }
        result.matched.push({
          ...item,
          ingredient_id: candidates[0].id,
          canonical_name: candidates[0].canonical_name,
          canonical_name_ua: candidates[0].canonical_name_ua,
        });
      } else {
        // Ambiguous — multiple close matches
        result.ambiguous.push({
          ...item,
          candidates: candidates.slice(0, 5),
        });
      }
    }

    return result;
  }

  private async findCandidates(
    name: string,
  ): Promise<
    {
      id: string;
      canonical_name: string;
      canonical_name_ua?: string;
      similarity: number;
    }[]
  > {
    const client = this.supabase.getClient();

    // First check exact alias match
    const { data: aliasMatch } = await client
      .from('master_ingredients')
      .select('id, canonical_name, canonical_name_ua')
      .contains('aliases', [name.toLowerCase()])
      .limit(1);

    if (aliasMatch && aliasMatch.length > 0) {
      return [{ ...aliasMatch[0], similarity: 1.0 }];
    }

    // Trigram fuzzy search
    const { data, error } = await client.rpc('fuzzy_match_ingredient', {
      search_term: name,
    });

    if (error) {
      this.logger.warn(`Fuzzy search failed for "${name}": ${error.message}`);
      // Fallback to ilike
      const { data: fallback } = await client
        .from('master_ingredients')
        .select('id, canonical_name, canonical_name_ua')
        .ilike('canonical_name', `%${name}%`)
        .limit(5);
      return (fallback ?? []).map((r) => ({ ...r, similarity: 0.5 }));
    }

    return data ?? [];
  }

  private async updateUkrainianName(id: string, nameUa: string): Promise<void> {
    const client = this.supabase.getClient();
    await client
      .from('master_ingredients')
      .update({ canonical_name_ua: nameUa })
      .eq('id', id);
  }

  async createMasterIngredient(
    item: ExtractedItem,
  ): Promise<{
    id: string;
    canonical_name: string;
    canonical_name_ua?: string;
  } | null> {
    const client = this.supabase.getClient();
    // Capitalize first letter
    const canonicalName =
      item.name.charAt(0).toUpperCase() + item.name.slice(1);

    const { data, error } = await client
      .from('master_ingredients')
      .insert({
        canonical_name: canonicalName,
        canonical_name_ua: item.name_ua || null,
        default_unit: item.unit,
        aliases: [item.name.toLowerCase()],
      })
      .select('id, canonical_name, canonical_name_ua')
      .single();

    if (error) {
      this.logger.warn(
        `Failed to create ingredient "${canonicalName}": ${error.message}`,
      );
      return null;
    }

    return data;
  }
}
