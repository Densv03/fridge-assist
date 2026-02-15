import 'package:freezed_annotation/freezed_annotation.dart';
import 'master_ingredient.dart';

part 'inventory_item.freezed.dart';
part 'inventory_item.g.dart';

@freezed
class InventoryItem with _$InventoryItem {
  const factory InventoryItem({
    required String id,
    @JsonKey(name: 'user_id') required String userId,
    @JsonKey(name: 'ingredient_id') required String ingredientId,
    required double quantity,
    required String unit,
    required String status,
    @JsonKey(name: 'expires_at') String? expiresAt,
    @JsonKey(name: 'created_at') required String createdAt,
    @JsonKey(name: 'updated_at') required String updatedAt,
    @JsonKey(name: 'master_ingredients') required MasterIngredient masterIngredients,
  }) = _InventoryItem;

  factory InventoryItem.fromJson(Map<String, dynamic> json) =>
      _$InventoryItemFromJson(json);
}
