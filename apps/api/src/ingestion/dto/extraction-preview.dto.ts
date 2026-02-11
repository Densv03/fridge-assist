export interface PreviewItem {
  id: string;
  raw_name: string;
  canonical_name: string;
  canonical_name_ua?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  confidence: number;
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
}
