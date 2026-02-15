export interface UnitConflict {
  existing_unit: string;
  existing_quantity: number;
  ai_estimate_quantity: number;
  ai_estimate_combined: number;
  resolution: 'combine' | 'separate' | null;
}

export interface PreviewItem {
  id: string;
  raw_name: string;
  canonical_name: string;
  canonical_name_ua?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  confidence: number;
  unit_conflict?: UnitConflict;
}

export interface PreviewClarification {
  id: string;
  raw_name: string;
  quantity: number;
  unit: string;
  candidates: {
    id: string;
    canonical_name: string;
    canonical_name_ua?: string;
  }[];
}

export interface ExtractionPreview {
  preview_id: string;
  intent: string;
  items: PreviewItem[];
  clarifications: PreviewClarification[];
  cleared_count?: number;
  report_type?: 'bug' | 'idea';
  report_description?: string;
}
