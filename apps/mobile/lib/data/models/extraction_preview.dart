import 'package:freezed_annotation/freezed_annotation.dart';

part 'extraction_preview.freezed.dart';
part 'extraction_preview.g.dart';

@freezed
class UnitConflict with _$UnitConflict {
  const factory UnitConflict({
    @JsonKey(name: 'existing_unit') required String existingUnit,
    @JsonKey(name: 'existing_quantity') required double existingQuantity,
    @JsonKey(name: 'ai_estimate_quantity') required double aiEstimateQuantity,
    @JsonKey(name: 'ai_estimate_combined') required double aiEstimateCombined,
    String? resolution,
  }) = _UnitConflict;

  factory UnitConflict.fromJson(Map<String, dynamic> json) =>
      _$UnitConflictFromJson(json);
}

@freezed
class PreviewItem with _$PreviewItem {
  const factory PreviewItem({
    required String id,
    @JsonKey(name: 'raw_name') required String rawName,
    @JsonKey(name: 'canonical_name') required String canonicalName,
    @JsonKey(name: 'canonical_name_ua') String? canonicalNameUa,
    @JsonKey(name: 'ingredient_id') required String ingredientId,
    required double quantity,
    required String unit,
    required double confidence,
    @JsonKey(name: 'unit_conflict') UnitConflict? unitConflict,
  }) = _PreviewItem;

  factory PreviewItem.fromJson(Map<String, dynamic> json) =>
      _$PreviewItemFromJson(json);
}

@freezed
class PreviewClarification with _$PreviewClarification {
  const factory PreviewClarification({
    required String id,
    @JsonKey(name: 'raw_name') required String rawName,
    required double quantity,
    required String unit,
    required List<ClarificationCandidate> candidates,
  }) = _PreviewClarification;

  factory PreviewClarification.fromJson(Map<String, dynamic> json) =>
      _$PreviewClarificationFromJson(json);
}

@freezed
class ClarificationCandidate with _$ClarificationCandidate {
  const factory ClarificationCandidate({
    required String id,
    @JsonKey(name: 'canonical_name') required String canonicalName,
    @JsonKey(name: 'canonical_name_ua') String? canonicalNameUa,
  }) = _ClarificationCandidate;

  factory ClarificationCandidate.fromJson(Map<String, dynamic> json) =>
      _$ClarificationCandidateFromJson(json);
}

@freezed
class ExtractionPreview with _$ExtractionPreview {
  const factory ExtractionPreview({
    @JsonKey(name: 'preview_id') required String previewId,
    required String intent,
    required List<PreviewItem> items,
    required List<PreviewClarification> clarifications,
    @JsonKey(name: 'cleared_count') int? clearedCount,
  }) = _ExtractionPreview;

  factory ExtractionPreview.fromJson(Map<String, dynamic> json) =>
      _$ExtractionPreviewFromJson(json);
}
