import 'dart:io';
import 'package:dio/dio.dart';
import '../models/extraction_preview.dart';

class IngestionRepository {
  final Dio _dio;

  IngestionRepository(this._dio);

  Future<ExtractionPreview> previewText(String text) async {
    final response = await _dio.post('/ingestion/preview/text', data: {'text': text});
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> previewImage(File file) async {
    final formData = FormData.fromMap({
      'image': await MultipartFile.fromFile(file.path, filename: file.path.split('/').last),
    });
    final response = await _dio.post('/ingestion/preview/image', data: formData);
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> previewAudio(File file) async {
    final formData = FormData.fromMap({
      'audio': await MultipartFile.fromFile(file.path, filename: file.path.split('/').last),
    });
    final response = await _dio.post('/ingestion/preview/audio', data: formData);
    return ExtractionPreview.fromJson(response.data);
  }

  Future<dynamic> confirm(String previewId) async {
    final response = await _dio.post('/ingestion/preview/$previewId/confirm');
    return response.data;
  }

  Future<void> cancel(String previewId) async {
    await _dio.post('/ingestion/preview/$previewId/cancel');
  }

  Future<ExtractionPreview> removeItem(String previewId, String itemId) async {
    final response = await _dio.delete('/ingestion/preview/$previewId/items/$itemId');
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> resolveItem(
    String previewId,
    String clarificationId,
    String ingredientId,
  ) async {
    final response = await _dio.post(
      '/ingestion/preview/$previewId/clarifications/$clarificationId/resolve',
      data: {'ingredient_id': ingredientId},
    );
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> addCustomItem(
    String previewId,
    String clarificationId,
    String name,
  ) async {
    final response = await _dio.post(
      '/ingestion/preview/$previewId/clarifications/$clarificationId/custom',
      data: {'name': name},
    );
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> replaceItem(
    String previewId,
    String itemId,
    String name,
  ) async {
    final response = await _dio.post(
      '/ingestion/preview/$previewId/items/$itemId/replace',
      data: {'name': name},
    );
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> changeAmount(
    String previewId,
    String itemId,
    String amount,
  ) async {
    final response = await _dio.post(
      '/ingestion/preview/$previewId/items/$itemId/change-amount',
      data: {'amount': amount},
    );
    return ExtractionPreview.fromJson(response.data);
  }

  Future<ExtractionPreview> resolveConflict(
    String previewId,
    String itemId,
    String resolution,
  ) async {
    final response = await _dio.post(
      '/ingestion/preview/$previewId/items/$itemId/resolve-conflict',
      data: {'resolution': resolution},
    );
    return ExtractionPreview.fromJson(response.data);
  }
}
