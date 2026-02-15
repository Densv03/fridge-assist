export interface ResolvedUser {
  id: string;
  provider: string;
  provider_user_id: string;
  name?: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  preferred_language?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface MasterIngredient {
  canonical_name: string;
  canonical_name_ua?: string;
  category?: string;
  default_unit?: string;
}

export interface InventoryItem {
  id: string;
  user_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  master_ingredients: MasterIngredient;
}

export interface ProcessedItem {
  raw_name: string;
  canonical_name: string;
  canonical_name_ua?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  action: 'ADD' | 'CONSUME' | 'WASTE' | 'SET' | 'ADJUSTMENT';
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

// ── Preview types ──

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
  candidates: { id: string; canonical_name: string; canonical_name_ua?: string }[];
}

export interface ExtractionPreview {
  preview_id: string;
  intent: string;
  items: PreviewItem[];
  clarifications: PreviewClarification[];
  cleared_count?: number;
}

// ── Recipe types ──

export interface MissingIngredient {
  name_en: string;
  name_ua: string;
}

export interface RecipeSuggestion {
  dish_name_en: string;
  dish_name_ua: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Dessert' | 'Drink';
  used_ingredients: string[];
  missing_ingredients?: MissingIngredient[];
}

export interface RecipeSuggestionsResponse {
  can_cook: RecipeSuggestion[];
  need_to_buy: RecipeSuggestion[];
  empty_fridge?: boolean;
}

export interface RecipeIngredient {
  name_en: string;
  name_ua: string;
  quantity: string;
  quantity_ua: string;
  quantity_num: number;
  unit: string;
}

export interface RecipeStep {
  step_en: string;
  step_ua: string;
}

export interface RecipeDetail {
  dish_name_en: string;
  dish_name_ua: string;
  servings: number;
  cook_time_minutes: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
}

export interface ConsumeResult {
  consumed: Array<{ name_en: string; quantity: number; unit: string }>;
  skipped: string[];
}
