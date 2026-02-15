import 'package:dio/dio.dart';
import '../models/inventory_item.dart';

class InventoryRepository {
  final Dio _dio;

  InventoryRepository(this._dio);

  Future<List<InventoryItem>> getAll() async {
    final response = await _dio.get('/inventory');
    return (response.data as List)
        .map((e) => InventoryItem.fromJson(e))
        .toList();
  }

  Future<InventoryItem> update(String id, Map<String, dynamic> data) async {
    final response = await _dio.patch('/inventory/$id', data: data);
    return InventoryItem.fromJson(response.data);
  }

  Future<void> delete(String id) async {
    await _dio.delete('/inventory/$id');
  }
}
