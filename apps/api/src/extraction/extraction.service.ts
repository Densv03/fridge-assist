import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { Type } from '@google/genai';
import { ExtractionResult } from './interfaces/extraction-result.interface';

const SYSTEM_PROMPT = `You are a kitchen inventory assistant. Extract food items from user input.
The user may write in ANY language (English, Ukrainian, Russian, etc.). You MUST understand the input regardless of language.

Rules:
- ALWAYS return ingredient names in English in the "name" field, no matter what language the input is in
  Examples: "яйця" → "Eggs", "молоко" → "Milk", "хліб" → "Bread", "курка" → "Chicken Breast", "рис" → "Rice"
- ALWAYS return the Ukrainian translation in the "name_ua" field
  Examples: "Eggs" → "Яйця", "Milk" → "Молоко", "Bread" → "Хліб", "Chicken Breast" → "Куряче філе", "Tea" → "Чай", "Ice Cream" → "Морозиво", "Sunflower Seeds" → "Насіння соняшнику"
- Determine the intent: ADD (bought/received), CONSUME (ate/used/cooked), WASTE (threw away/expired/spoiled), or CLEAR_ALL (ate/used/threw away EVERYTHING, emptied the fridge)
  Intent keywords by language:
  - UA: купив/купила = ADD, з'їв/з'їла/приготував = CONSUME, викинув/зіпсувалось = WASTE
  - RU: купил/купила = ADD, съел/съела/приготовил = CONSUME, выбросил/испортилось = WASTE
  - "ate everything"/"з'їв все"/"съел всё"/"cleared the fridge"/"очистив холодильник" = CLEAR_ALL
- Use CLEAR_ALL when the user means ALL items without naming specific ones. Return an EMPTY items array with CLEAR_ALL
- Default intent is ADD if unclear
- Normalize quantities: "a dozen"/"дюжина" = 12, "a couple"/"пара" = 2, "a few"/"кілька"/"несколько" = 3
- Use standard units: pcs, grams, kg, liters, ml, cups, tbsp, tsp
- Convert informal units: "a gallon" = 3.785 liters, "a pound"/"фунт" = 453.6 grams
- Extract the plain ingredient name without brand names
- If quantity is not specified, default to 1
- If unit is not specified, default to "pcs"
- NEVER return vague or generic items like "Food", "Groceries", "Stuff", "Everything", "Items", "Products"
- Only return specific, identifiable food ingredients (e.g. "Milk", "Bread", "Eggs")
- If the input is too vague to identify specific items and is NOT a clear-all command (e.g. "bought some stuff"), return an EMPTY items array with ADD intent
- Assign a category to each item from this list: Bakery, Baking, Beverages, Dairy & Eggs, Fruits, Grains & Pasta, Meat & Poultry, Oils & Condiments, Seafood, Snacks & Sweets, Spices & Seasonings, Vegetables, Other
  Examples: "Milk" → "Dairy & Eggs", "Apple" → "Fruits", "Chicken" → "Meat & Poultry", "Tea" → "Beverages", "Ice Cream" → "Snacks & Sweets", "Rice" → "Grains & Pasta", "Bread" → "Bakery"
- Non-food items should be ignored`;

const PARSE_QUANTITY_PROMPT = `You are a quantity parser for a kitchen inventory app.
Parse the user's free-form text into a structured quantity and unit.

Rules:
- The user may write in ANY language (English, Ukrainian, Russian, etc.)
- If the input does NOT represent a quantity or amount (e.g. random words, gibberish, unrelated text), set "valid" to false
- If the input is a recognizable quantity/amount, set "valid" to true
- Normalize quantities: "a dozen"/"дюжина" = 12, "a couple"/"пара" = 2, "a few"/"кілька"/"несколько" = 3
- "half"/"пів"/"половина" = 0.5
- Use standard units: pcs, grams, kg, liters, ml, cups, tbsp, tsp
- Convert informal units: "a gallon" = 3.785 liters, "a pound"/"фунт" = 453.6 grams
- Abbreviations: "г"/"g" = grams, "кг" = kg, "л"/"l" = liters, "мл" = ml, "шт" = pcs
- If the user provides only a number without a unit, use the provided current_unit as the unit
- If the user provides a unit, use that unit (normalized to standard form)
- Always return a positive number for quantity`;

const PARSE_QUANTITY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    valid: { type: Type.BOOLEAN },
    quantity: { type: Type.NUMBER },
    unit: { type: Type.STRING },
  },
  required: ['valid', 'quantity', 'unit'],
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    intent: {
      type: Type.STRING,
      enum: ['ADD', 'CONSUME', 'WASTE', 'CLEAR_ALL'],
    },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          name_ua: { type: Type.STRING },
          quantity: { type: Type.NUMBER },
          unit: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: [
              'Bakery',
              'Baking',
              'Beverages',
              'Dairy & Eggs',
              'Fruits',
              'Grains & Pasta',
              'Meat & Poultry',
              'Oils & Condiments',
              'Seafood',
              'Snacks & Sweets',
              'Spices & Seasonings',
              'Vegetables',
              'Other',
            ],
          },
        },
        required: ['name', 'name_ua', 'quantity', 'unit', 'category'],
      },
    },
  },
  required: ['intent', 'items'],
};

@Injectable()
export class ExtractionService {
  private readonly logger = new Logger(ExtractionService.name);
  private readonly model = 'gemini-2.0-flash';

  constructor(private gemini: GeminiService) {}

  async extractFromText(text: string): Promise<ExtractionResult> {
    const ai = this.gemini.getClient();

    const response = await ai.models.generateContent({
      model: this.model,
      contents: text,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    this.logger.debug(`Extraction result: ${response.text}`);
    return JSON.parse(response.text);
  }

  async extractFromImage(
    buffer: Buffer,
    mimeType: string,
  ): Promise<ExtractionResult> {
    const ai = this.gemini.getClient();
    const base64 = buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: this.model,
      contents: [
        {
          inlineData: { data: base64, mimeType },
        },
        'Extract all food/grocery items from this receipt or image. List each item with quantity and unit.',
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    this.logger.debug(`Image extraction result: ${response.text}`);
    return JSON.parse(response.text);
  }

  async extractFromAudio(
    buffer: Buffer,
    mimeType: string,
  ): Promise<ExtractionResult> {
    const ai = this.gemini.getClient();
    const base64 = buffer.toString('base64');

    const response = await ai.models.generateContent({
      model: this.model,
      contents: [
        {
          inlineData: { data: base64, mimeType },
        },
        'Transcribe and extract all food/grocery items mentioned. List each item with quantity and unit.',
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    this.logger.debug(`Audio extraction result: ${response.text}`);
    return JSON.parse(response.text);
  }

  async parseQuantity(
    text: string,
    currentUnit: string,
  ): Promise<{ valid: boolean; quantity: number; unit: string }> {
    const ai = this.gemini.getClient();

    const response = await ai.models.generateContent({
      model: this.model,
      contents: `current_unit: ${currentUnit}\nuser input: ${text}`,
      config: {
        systemInstruction: PARSE_QUANTITY_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: PARSE_QUANTITY_SCHEMA,
      },
    });

    this.logger.debug(`Parse quantity result: ${response.text}`);
    return JSON.parse(response.text);
  }
}
