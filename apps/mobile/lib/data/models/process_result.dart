import 'package:freezed_annotation/freezed_annotation.dart';

part 'process_result.freezed.dart';
part 'process_result.g.dart';

@freezed
class ProcessedItem with _$ProcessedItem {
  const factory ProcessedItem({
    @JsonKey(name: 'raw_name') required String rawName,
    @JsonKey(name: 'canonical_name') required String canonicalName,
    @JsonKey(name: 'canonical_name_ua') String? canonicalNameUa,
    @JsonKey(name: 'ingredient_id') required String ingredientId,
    required double quantity,
    required String unit,
    required String action,
  }) = _ProcessedItem;

  factory ProcessedItem.fromJson(Map<String, dynamic> json) =>
      _$ProcessedItemFromJson(json);
}

@freezed
class Clarification with _$Clarification {
  const factory Clarification({
    @JsonKey(name: 'raw_name') required String rawName,
    required double quantity,
    required String unit,
    required List<ClarificationOption> candidates,
  }) = _Clarification;

  factory Clarification.fromJson(Map<String, dynamic> json) =>
      _$ClarificationFromJson(json);
}

@freezed
class ClarificationOption with _$ClarificationOption {
  const factory ClarificationOption({
    required String id,
    @JsonKey(name: 'canonical_name') required String canonicalName,
    @JsonKey(name: 'canonical_name_ua') String? canonicalNameUa,
  }) = _ClarificationOption;

  factory ClarificationOption.fromJson(Map<String, dynamic> json) =>
      _$ClarificationOptionFromJson(json);
}

@freezed
class ProcessResult with _$ProcessResult {
  const factory ProcessResult({
    required String status,
    @JsonKey(name: 'processed_items') required List<ProcessedItem> processedItems,
    required List<Clarification> clarifications,
    @JsonKey(name: 'transaction_ids') required List<String> transactionIds,
    @JsonKey(name: 'cleared_count') int? clearedCount,
  }) = _ProcessResult;

  factory ProcessResult.fromJson(Map<String, dynamic> json) =>
      _$ProcessResultFromJson(json);
}
