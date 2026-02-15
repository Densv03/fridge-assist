import 'package:dio/dio.dart';
import '../models/user.dart';

class UserRepository {
  final Dio _dio;

  UserRepository(this._dio);

  Future<User> updatePreferredLanguage(String userId, String language) async {
    final response = await _dio.patch(
      '/users/$userId',
      data: {'preferred_language': language},
    );
    return User.fromJson(response.data);
  }
}
