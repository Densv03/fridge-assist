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
- Determine the intent: ADD (bought/received), CONSUME (ate/used/cooked), WASTE (threw away/expired/spoiled), SET (remaining/left — user states absolute quantity currently on hand), CLEAR_ALL (ate/used/threw away EVERYTHING, emptied the fridge), COOK (wants to cook something / asks for recipe suggestions), or FRIDGE (wants to see what's in the fridge)
  Intent keywords by language:
  - UA: купив/купила = ADD, з'їв/з'їла/приготував = CONSUME, викинув/зіпсувалось = WASTE
  - RU: купил/купила = ADD, съел/съела/приготовил = CONSUME, выбросил/испортилось = WASTE
  - SET intent: user states what REMAINS or what they currently HAVE (absolute quantity, not a delta)
    EN keywords: "remains", "left", "have left", "remaining", "I have", "there is"
    UA keywords: "залишилось", "залишилося", "лишилось", "є", "маю", "лишилося"
    RU keywords: "осталось", "осталась", "остался", "есть", "имеется"
  - Disambiguation: "bought 2 eggs" = ADD, "2 eggs remain" = SET, "ate 2 eggs" = CONSUME, "2 eggs left" = SET
  - "ate everything"/"з'їв все"/"съел всё"/"cleared the fridge"/"очистив холодильник" = CLEAR_ALL
  - COOK intent: user wants to cook something or asks for recipe suggestions
    Keywords: "want to cook", "what can I make", "suggest recipe", "що приготувати", "хочу приготувати", "что приготовить", "що зготувати"
  - For COOK: extract mentioned ingredients as items (if any). If no specific ingredient is mentioned, return empty items array.
  - Do NOT confuse with CONSUME ("cooked chicken yesterday" = CONSUME, "want to cook chicken" = COOK)
  - FRIDGE intent: user wants to see their fridge contents / inventory
    Keywords: "what's in my fridge", "what do I have", "show my fridge", "що в мене є", "що в холодильнику", "покажи холодильник", "что в холодильнике", "что у меня есть"
  - For FRIDGE: return an EMPTY items array
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

const CONVERT_UNIT_PROMPT = `You are a kitchen assistant that converts food quantities between units.
Given an ingredient name, a quantity, and the source and target units, estimate the conversion using average weight/size for that ingredient.

Rules:
- Use your knowledge of average food item sizes and weights
- For example: 1 avocado (pcs) ≈ 200g, 1 egg (pcs) ≈ 60g, 1 banana (pcs) ≈ 120g
- Return the converted quantity as a number rounded to 2 decimal places
- If conversion is impossible or nonsensical, return quantity 0`;

const CONVERT_UNIT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    quantity: { type: Type.NUMBER },
    unit: { type: Type.STRING },
  },
  required: ['quantity', 'unit'],
};

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
      enum: ['ADD', 'CONSUME', 'WASTE', 'SET', 'CLEAR_ALL', 'COOK', 'FRIDGE'],
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

  async convertUnit(
    quantity: number,
    fromUnit: string,
    toUnit: string,
    ingredientName: string,
  ): Promise<{ quantity: number; unit: string }> {
    const ai = this.gemini.getClient();

    const prompt = `Convert ${quantity} ${fromUnit} of ${ingredientName} to ${toUnit}. Use average weight/size for this ingredient.`;

    const response = await ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: CONVERT_UNIT_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: CONVERT_UNIT_SCHEMA,
      },
    });

    this.logger.debug(`Convert unit result: ${response.text}`);
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
