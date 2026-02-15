import 'package:freezed_annotation/freezed_annotation.dart';

part 'master_ingredient.freezed.dart';
part 'master_ingredient.g.dart';

@freezed
class MasterIngredient with _$MasterIngredient {
  const factory MasterIngredient({
    @JsonKey(name: 'canonical_name') required String canonicalName,
    @JsonKey(name: 'canonical_name_ua') String? canonicalNameUa,
    String? category,
    @JsonKey(name: 'default_unit') String? defaultUnit,
  }) = _MasterIngredient;

  factory MasterIngredient.fromJson(Map<String, dynamic> json) =>
      _$MasterIngredientFromJson(json);
}
