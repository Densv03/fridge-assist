export interface ExtractedItem {
  name: string;
  name_ua: string;
  quantity: number;
  unit: string;
  category: string;
}

export interface ExtractionResult {
  intent: 'ADD' | 'CONSUME' | 'WASTE' | 'SET' | 'CLEAR_ALL' | 'COOK' | 'FRIDGE' | 'REPORT';
  items: ExtractedItem[];
  report_type?: 'bug' | 'idea';
  report_description?: string;
}
