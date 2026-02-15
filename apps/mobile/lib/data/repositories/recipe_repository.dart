import 'package:dio/dio.dart';
import '../models/recipe.dart';

class RecipeRepository {
  final Dio _dio;

  RecipeRepository(this._dio);

  Future<RecipeSuggestionsResponse> getSuggestions({List<String>? categories}) async {
    final queryParams = <String, dynamic>{};
    if (categories != null && categories.isNotEmpty) {
      queryParams['categories'] = categories.join(',');
    }
    final response = await _dio.get('/recipes/suggestions', queryParameters: queryParams);
    return RecipeSuggestionsResponse.fromJson(response.data);
  }

  Future<RecipeDetail> getDetail(List<String> dishNames) async {
    final response = await _dio.post('/recipes/detail', data: {'dish_names': dishNames});
    return RecipeDetail.fromJson(response.data);
  }

  Future<ConsumeResult> consume(List<String> dishNames) async {
    final response = await _dio.post('/recipes/consume', data: {'dish_names': dishNames});
    return ConsumeResult.fromJson(response.data);
  }
}
