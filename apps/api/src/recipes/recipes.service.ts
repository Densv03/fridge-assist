import { Injectable, Logger } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';
import { InventoryService } from '../inventory/inventory.service';
import { IngredientsService } from '../ingredients/ingredients.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CookingHistoryService } from './cooking-history.service';
import { ActionType } from '../common/enums/action-type.enum';
import { areUnitsCompatible } from '../common/utils/unit-conversion';
import { Type } from '@google/genai';

function buildSuggestionPrompt(maxMissing: number): string {
  return `You are a recipe suggestion assistant for a Ukrainian household kitchen app.
The user will provide a list of ingredients they have in their fridge with quantities.

## Available ingredients definition
The user's COMPLETE available ingredient set = the listed ingredients + ONLY these 6 pantry staples: salt, black pepper, sunflower oil, water, sugar, wheat flour.
NOTHING else exists in the kitchen.
Common items like bread, lemon juice, eggs, butter, milk, garlic, onion, sour cream, vinegar, mayonnaise are NOT available unless explicitly listed.

## Rules
- Suggest UP TO 5 dishes the user can cook RIGHT NOW using ONLY available ingredients. If fewer dishes are genuinely possible, return fewer. Returning 0-1 can_cook dishes is perfectly fine.
- Suggest up to 3 dishes that require buying extra ingredients. The total number of missing ingredients for each dish must be between 1 and ${maxMissing}. If a dish needs more than ${maxMissing} non-available ingredients, do NOT suggest it at all.
- If the user has very few ingredients (1-3 items), it is perfectly acceptable to return 0 can_cook dishes and fill need_to_buy instead.
- Consider quantities: do NOT suggest a dish requiring 1kg of chicken if the user only has 200g.
- Prefer everyday Ukrainian/Eastern European cuisine, but include international dishes too.
- Return dish names in BOTH English (dish_name_en) and Ukrainian (dish_name_ua).
- Assign a category to each dish: Breakfast, Lunch, Dinner, Snack, Dessert, or Drink.
- For "can_cook" dishes, list which of the user's ingredients are used (English names).
- For "need_to_buy" dishes, list used ingredients AND list EVERY missing ingredient (both EN and UA names). Do NOT omit any missing ingredient.
- Make suggestions diverse — avoid repeating similar dishes.
- Dish names should be specific (e.g. "Chicken Fried Rice" not just "Rice").

## Strict verification gate for can_cook (MANDATORY)
For EACH can_cook dish, before including it:
1. Write out the FULL ingredient list the dish requires (every single one).
2. Remove the 6 pantry staples from that list.
3. Check each remaining ingredient against the user's ingredient list.
4. If ANY ingredient is not found in the user's list → the dish CANNOT be in can_cook. Move it to need_to_buy or discard it.
Zero exceptions. Do NOT assume, hallucinate, or skip ingredients.

## Strict verification gate for need_to_buy (MANDATORY)
For EACH need_to_buy dish:
1. Write out the FULL ingredient list the dish requires (every single one).
2. Remove the 6 pantry staples from that list.
3. Every remaining ingredient that is NOT in the user's list MUST appear in missing_ingredients. List ALL of them — do not omit any.
4. Count the missing ingredients. If there are more than ${maxMissing}, REMOVE this dish entirely.`;
}

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    can_cook: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dish_name_en: { type: Type.STRING },
          dish_name_ua: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'],
          },
          used_ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'dish_name_en',
          'dish_name_ua',
          'category',
          'used_ingredients',
        ],
      },
    },
    need_to_buy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          dish_name_en: { type: Type.STRING },
          dish_name_ua: { type: Type.STRING },
          category: {
            type: Type.STRING,
            enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Drink'],
          },
          used_ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          missing_ingredients: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name_en: { type: Type.STRING },
                name_ua: { type: Type.STRING },
              },
              required: ['name_en', 'name_ua'],
            },
          },
        },
        required: [
          'dish_name_en',
          'dish_name_ua',
          'category',
          'used_ingredients',
          'missing_ingredients',
        ],
      },
    },
  },
  required: ['can_cook', 'need_to_buy'],
};

const CREATIVE_SUGGESTION_PROMPT = `You are a creative recipe suggestion assistant for a Ukrainian household kitchen app.
The user wants inspiring, diverse recipe ideas — NOT limited to what they have in the fridge.

## Rules
- Suggest 0 dishes in "can_cook" (leave the array empty).
- Suggest up to 8 dishes in "need_to_buy" — creative, diverse, spanning multiple cuisines (Ukrainian, Italian, Asian, Mexican, Middle Eastern, etc.).
- Each dish should list ALL ingredients the user would need to buy (everything not in the 6 pantry staples: salt, black pepper, sunflower oil, water, sugar, wheat flour).
- If the user has fridge contents provided for reference, prefer dishes that partially use those ingredients, but do NOT limit yourself to them.
- Make suggestions diverse — mix comfort food, quick meals, impressive dishes, healthy options.
- Return dish names in BOTH English (dish_name_en) and Ukrainian (dish_name_ua).
- Assign a category: Breakfast, Lunch, Dinner, Snack, Dessert, or Drink.
- For "need_to_buy" dishes, list used_ingredients (from fridge, if any) AND list EVERY missing ingredient (EN and UA names).
- Dish names should be specific (e.g. "Thai Green Curry" not just "Curry").`;

const DETAIL_SYSTEM_PROMPT = `You are a recipe generation assistant for a Ukrainian household kitchen app.
The user will provide a dish name and a list of ingredients they have available.

Rules:
- Generate a complete recipe for the specified dish
- Use the available ingredients as much as possible
- You may assume these pantry staples are available: salt, black pepper, sunflower oil, water, sugar, wheat flour
- If the dish absolutely requires an ingredient not in the list, include it anyway (the user may need to buy it)
- Provide ingredient quantities appropriate for the specified servings
- Write clear, numbered cooking steps
- Provide all text in BOTH English and Ukrainian
- Keep steps concise but complete
- Estimate realistic cooking time in minutes
- For each ingredient, also return quantity_num as the raw numeric value (e.g. 500, 2, 0.5) and unit as one of: grams, kg, ml, liters, cups, tbsp, tsp, pcs. Use 0 for quantity_num if the ingredient has no measurable quantity (e.g. "to taste").
- For quantity_num and unit: you MUST use the SAME unit as shown in the user's available ingredients list.
  For example if the user has "Avocado: 0.7 kg", return unit "kg" and an appropriate quantity_num in kg (e.g. 0.15).
  If the ingredient is not in the user's list (missing/extra), use the most natural unit from: grams, kg, ml, liters, cups, tbsp, tsp, pcs.`;

const DETAIL_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    dish_name_en: { type: Type.STRING },
    dish_name_ua: { type: Type.STRING },
    servings: { type: Type.NUMBER },
    cook_time_minutes: { type: Type.NUMBER },
    ingredients: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name_en: { type: Type.STRING },
          name_ua: { type: Type.STRING },
          quantity: { type: Type.STRING },
          quantity_ua: { type: Type.STRING },
          quantity_num: { type: Type.NUMBER },
          unit: { type: Type.STRING },
        },
        required: ['name_en', 'name_ua', 'quantity', 'quantity_ua', 'quantity_num', 'unit'],
      },
    },
    steps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step_en: { type: Type.STRING },
          step_ua: { type: Type.STRING },
        },
        required: ['step_en', 'step_ua'],
      },
    },
  },
  required: [
    'dish_name_en',
    'dish_name_ua',
    'servings',
    'cook_time_minutes',
    'ingredients',
    'steps',
  ],
};

@Injectable()
export class RecipesService {
  private readonly logger = new Logger(RecipesService.name);
  private readonly model = 'gemini-2.0-flash';

  constructor(
    private gemini: GeminiService,
    private inventory: InventoryService,
    private ingredients: IngredientsService,
    private transactions: TransactionsService,
    private cookingHistory: CookingHistoryService,
  ) {}

  async getSuggestions(
    userId: string,
    options?: { exclude?: string[]; mode?: 'more' | 'creative'; categories?: string[] },
  ) {
    if (options?.mode === 'creative') {
      return this.getCreativeSuggestions(userId, options.exclude, options.categories);
    }

    const items = await this.inventory.findAllForUser(userId);

    if (!items || items.length === 0) {
      return { can_cook: [], need_to_buy: [], empty_fridge: true };
    }

    const ingredientList = items
      .map(
        (item) =>
          `- ${item.master_ingredients?.canonical_name ?? 'Unknown'}: ${item.quantity} ${item.unit}`,
      )
      .join('\n');

    const tasteInstruction = await this.buildTasteProfileInstruction(userId);

    // Attempt 1: strict — hard exclude + max 3 missing
    const strictInstructions: string[] = [];
    if (options?.exclude?.length) {
      strictInstructions.push(
        `Do NOT suggest these dishes (already shown): ${options.exclude.join(', ')}. Suggest completely different dishes.`,
      );
    }
    if (options?.categories?.length) {
      strictInstructions.push(
        `ONLY suggest dishes from these meal categories: ${options.categories.join(', ')}. Do NOT suggest dishes from any other category.`,
      );
    }
    if (tasteInstruction) strictInstructions.push(tasteInstruction);

    const strictResult = await this.callGeminiForSuggestions(
      strictInstructions,
      buildSuggestionPrompt(3),
      `Here are the ingredients in my fridge:\n\n${ingredientList}\n\nSuggest recipes I can cook.`,
    );
    const filtered = this.filterExcluded(strictResult, options?.exclude);

    if (filtered.can_cook.length > 0 || filtered.need_to_buy.length > 0) {
      return filtered;
    }

    // Attempt 2: relaxed — soft exclude preference + max 5 missing
    this.logger.log('Strict suggestions empty, retrying with relaxed constraints');
    const relaxedInstructions: string[] = [];
    if (options?.exclude?.length) {
      relaxedInstructions.push(
        `User has already seen these dishes: ${options.exclude.join(', ')}. Try to suggest different ones, but it's OK to repeat if needed.`,
      );
    }
    if (options?.categories?.length) {
      relaxedInstructions.push(
        `ONLY suggest dishes from these meal categories: ${options.categories.join(', ')}. Do NOT suggest dishes from any other category.`,
      );
    }
    if (tasteInstruction) relaxedInstructions.push(tasteInstruction);

    const relaxedResult = await this.callGeminiForSuggestions(
      relaxedInstructions,
      buildSuggestionPrompt(5),
      `Here are the ingredients in my fridge:\n\n${ingredientList}\n\nSuggest recipes I can cook.`,
    );

    return relaxedResult;
  }

  private async getCreativeSuggestions(
    userId: string,
    exclude?: string[],
    categories?: string[],
  ) {
    const items = await this.inventory.findAllForUser(userId);

    const inventoryContext = items?.length
      ? items
          .map(
            (item) =>
              `- ${item.master_ingredients?.canonical_name ?? 'Unknown'}: ${item.quantity} ${item.unit}`,
          )
          .join('\n')
      : null;

    const tasteInstruction = await this.buildTasteProfileInstruction(userId);

    const extraInstructions: string[] = [];
    if (exclude?.length) {
      extraInstructions.push(
        `Do NOT suggest these dishes (already shown): ${exclude.join(', ')}. Suggest completely different dishes.`,
      );
    }
    if (categories?.length) {
      extraInstructions.push(
        `ONLY suggest dishes from these meal categories: ${categories.join(', ')}. Do NOT suggest dishes from any other category.`,
      );
    }
    if (tasteInstruction) extraInstructions.push(tasteInstruction);

    let userPrompt = 'Suggest creative and inspiring recipes.';
    if (inventoryContext) {
      userPrompt += `\n\nFor reference, here is what the user currently has in the fridge (but you are NOT limited to these):\n\n${inventoryContext}`;
    }

    const result = await this.callGeminiForSuggestions(
      extraInstructions,
      CREATIVE_SUGGESTION_PROMPT,
      userPrompt,
    );

    return this.filterExcluded(result, exclude);
  }

  private async buildTasteProfileInstruction(
    userId: string,
  ): Promise<string | null> {
    try {
      const recent = await this.cookingHistory.getRecent(userId);
      if (recent.length > 0) {
        const historyList = recent
          .map((r) => `${r.dish_name_en} (${new Date(r.cooked_at).toLocaleDateString()})`)
          .join(', ');
        const recentFive = recent.slice(0, 5).map((r) => r.dish_name_en).join(', ');
        return (
          `User's cooking history: ${historyList}. ` +
          `Use this to understand their taste preferences — suggest dishes in styles and cuisines they enjoy. ` +
          `Avoid exact duplicates of these 5 most recent dishes: ${recentFive}.`
        );
      }
    } catch (e) {
      this.logger.warn('Failed to fetch cooking history', e);
    }
    return null;
  }

  private async callGeminiForSuggestions(
    extraInstructions: string[],
    systemPrompt: string,
    userPrompt: string,
  ) {
    let prompt = userPrompt;
    if (extraInstructions.length > 0) {
      prompt += '\n\n' + extraInstructions.join('\n');
    }

    const ai = this.gemini.getClient();
    const response = await ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    this.logger.debug(`Recipe suggestions result: ${response.text}`);
    return JSON.parse(response.text);
  }

  private filterExcluded(
    result: { can_cook: Array<{ dish_name_en: string }>; need_to_buy: Array<{ dish_name_en: string }> },
    exclude?: string[],
  ) {
    if (!exclude?.length) return result;
    const excludeSet = new Set(exclude.map((n) => n.toLowerCase()));
    return {
      ...result,
      can_cook: result.can_cook.filter(
        (d) => !excludeSet.has(d.dish_name_en.toLowerCase()),
      ),
      need_to_buy: result.need_to_buy.filter(
        (d) => !excludeSet.has(d.dish_name_en.toLowerCase()),
      ),
    };
  }

  async getRecipeDetail(
    userId: string,
    dishNameEn: string,
    dishNameUa: string,
  ) {
    const items = await this.inventory.findAllForUser(userId);

    const ingredientList = items
      .map(
        (item) =>
          `- ${item.master_ingredients?.canonical_name ?? 'Unknown'}: ${item.quantity} ${item.unit}`,
      )
      .join('\n');

    const prompt = `Generate a complete recipe for: ${dishNameEn} (${dishNameUa})

Available ingredients:
${ingredientList}`;

    const ai = this.gemini.getClient();

    const response = await ai.models.generateContent({
      model: this.model,
      contents: prompt,
      config: {
        systemInstruction: DETAIL_SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        responseSchema: DETAIL_RESPONSE_SCHEMA,
      },
    });

    this.logger.debug(`Recipe detail result: ${response.text}`);
    return JSON.parse(response.text);
  }

  async consumeRecipe(
    userId: string,
    ingredients: Array<{ name_en: string; quantity_num: number; unit: string }>,
    dishInfo?: { dish_name_en: string; dish_name_ua: string; category?: string },
  ) {
    const consumed: Array<{ name_en: string; quantity: number; unit: string }> = [];
    const skipped: string[] = [];

    // Pre-load inventory once as lookup: ingredientId → { quantity, unit }
    const inventoryItems = await this.inventory.findAllForUser(userId);
    const inventoryMap = new Map<string, { quantity: number; unit: string }>();
    for (const item of inventoryItems ?? []) {
      inventoryMap.set(item.ingredient_id, { quantity: item.quantity, unit: item.unit });
    }

    for (const ing of ingredients) {
      const matches = await this.ingredients.searchFuzzy(ing.name_en);
      if (!matches || matches.length === 0) {
        skipped.push(ing.name_en);
        continue;
      }
      const ingredientId = matches[0].id;

      // Check if user actually has this ingredient in their fridge
      const invRow = inventoryMap.get(ingredientId);
      if (!invRow || invRow.quantity <= 0) {
        skipped.push(ing.name_en);
        continue;
      }

      // Check unit compatibility before calling adjustQuantity
      if (!areUnitsCompatible(invRow.unit, ing.unit)) {
        this.logger.warn(
          `Unit mismatch for ${ing.name_en}: recipe=${ing.unit}, inventory=${invRow.unit}. Skipping.`,
        );
        skipped.push(ing.name_en);
        continue;
      }

      try {
        await this.inventory.adjustQuantity(
          userId,
          ingredientId,
          -ing.quantity_num,
          ing.unit,
        );

        await this.transactions.log({
          userId,
          ingredientId,
          action: ActionType.CONSUME,
          quantityChange: -ing.quantity_num,
          unit: ing.unit,
          source: 'recipe',
          notes: 'Cooked recipe',
        });

        consumed.push({
          name_en: matches[0].canonical_name,
          quantity: ing.quantity_num,
          unit: ing.unit,
        });
      } catch (err) {
        this.logger.warn(
          `Failed to consume ${ing.name_en} for user ${userId}: ${err}`,
        );
        skipped.push(ing.name_en);
      }
    }

    if (dishInfo) {
      try {
        await this.cookingHistory.log(
          userId,
          dishInfo.dish_name_en,
          dishInfo.dish_name_ua,
          dishInfo.category,
        );
      } catch (e) {
        this.logger.warn('Failed to log cooking history', e);
      }
    }

    return { consumed, skipped };
  }
}
