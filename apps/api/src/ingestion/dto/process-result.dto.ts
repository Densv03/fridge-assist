export interface ProcessedItem {
  raw_name: string;
  canonical_name: string;
  canonical_name_ua?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  action: string;
}

export interface Clarification {
  raw_name: string;
  quantity: number;
  unit: string;
  candidates: { id: string; canonical_name: string; canonical_name_ua?: string }[];
}

export interface ProcessResult {
  status: 'completed' | 'needs_clarification';
  processed_items: ProcessedItem[];
  clarifications: Clarification[];
  transaction_ids: string[];
  cleared_count?: number;
}
