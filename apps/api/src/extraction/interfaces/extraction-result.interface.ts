export interface ExtractedItem {
  name: string;
  name_ua: string;
  quantity: number;
  unit: string;
}

export interface ExtractionResult {
  intent: 'ADD' | 'CONSUME' | 'WASTE' | 'CLEAR_ALL';
  items: ExtractedItem[];
}
