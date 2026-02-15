import 'package:freezed_annotation/freezed_annotation.dart';

part 'recipe.freezed.dart';
part 'recipe.g.dart';

@freezed
class MissingIngredient with _$MissingIngredient {
  const factory MissingIngredient({
    @JsonKey(name: 'name_en') required String nameEn,
    @JsonKey(name: 'name_ua') required String nameUa,
  }) = _MissingIngredient;

  factory MissingIngredient.fromJson(Map<String, dynamic> json) =>
      _$MissingIngredientFromJson(json);
}

@freezed
class RecipeSuggestion with _$RecipeSuggestion {
  const factory RecipeSuggestion({
    @JsonKey(name: 'dish_name_en') required String dishNameEn,
    @JsonKey(name: 'dish_name_ua') required String dishNameUa,
    required String category,
    @JsonKey(name: 'used_ingredients') required List<String> usedIngredients,
    @JsonKey(name: 'missing_ingredients') List<MissingIngredient>? missingIngredients,
  }) = _RecipeSuggestion;

  factory RecipeSuggestion.fromJson(Map<String, dynamic> json) =>
      _$RecipeSuggestionFromJson(json);
}

@freezed
class RecipeSuggestionsResponse with _$RecipeSuggestionsResponse {
  const factory RecipeSuggestionsResponse({
    @JsonKey(name: 'can_cook') required List<RecipeSuggestion> canCook,
    @JsonKey(name: 'need_to_buy') required List<RecipeSuggestion> needToBuy,
    @JsonKey(name: 'empty_fridge') @Default(false) bool emptyFridge,
  }) = _RecipeSuggestionsResponse;

  factory RecipeSuggestionsResponse.fromJson(Map<String, dynamic> json) =>
      _$RecipeSuggestionsResponseFromJson(json);
}

@freezed
class RecipeIngredient with _$RecipeIngredient {
  const factory RecipeIngredient({
    @JsonKey(name: 'name_en') required String nameEn,
    @JsonKey(name: 'name_ua') required String nameUa,
    required String quantity,
    @JsonKey(name: 'quantity_ua') required String quantityUa,
    @JsonKey(name: 'quantity_num') required double quantityNum,
    required String unit,
  }) = _RecipeIngredient;

  factory RecipeIngredient.fromJson(Map<String, dynamic> json) =>
      _$RecipeIngredientFromJson(json);
}

@freezed
class RecipeStep with _$RecipeStep {
  const factory RecipeStep({
    @JsonKey(name: 'step_en') required String stepEn,
    @JsonKey(name: 'step_ua') required String stepUa,
  }) = _RecipeStep;

  factory RecipeStep.fromJson(Map<String, dynamic> json) =>
      _$RecipeStepFromJson(json);
}

@freezed
class RecipeDetail with _$RecipeDetail {
  const factory RecipeDetail({
    @JsonKey(name: 'dish_name_en') required String dishNameEn,
    @JsonKey(name: 'dish_name_ua') required String dishNameUa,
    required int servings,
    @JsonKey(name: 'cook_time_minutes') required int cookTimeMinutes,
    required List<RecipeIngredient> ingredients,
    required List<RecipeStep> steps,
  }) = _RecipeDetail;

  factory RecipeDetail.fromJson(Map<String, dynamic> json) =>
      _$RecipeDetailFromJson(json);
}

@freezed
class ConsumeResult with _$ConsumeResult {
  const factory ConsumeResult({
    required List<ConsumedItem> consumed,
    required List<String> skipped,
  }) = _ConsumeResult;

  factory ConsumeResult.fromJson(Map<String, dynamic> json) =>
      _$ConsumeResultFromJson(json);
}

@freezed
class ConsumedItem with _$ConsumedItem {
  const factory ConsumedItem({
    @JsonKey(name: 'name_en') required String nameEn,
    required double quantity,
    required String unit,
  }) = _ConsumedItem;

  factory ConsumedItem.fromJson(Map<String, dynamic> json) =>
      _$ConsumedItemFromJson(json);
}
