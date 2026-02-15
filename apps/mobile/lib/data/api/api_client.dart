import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/constants/api_constants.dart';
import 'auth_interceptor.dart';

final dioProvider = Provider<Dio>((ref) {
  final dio = Dio(BaseOptions(
    baseUrl: ApiConstants.apiBaseUrl,
    connectTimeout: ApiConstants.requestTimeout,
    receiveTimeout: ApiConstants.requestTimeout,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  ));

  dio.interceptors.add(AuthInterceptor());

  return dio;
});
