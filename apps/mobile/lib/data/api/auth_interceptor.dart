import 'package:dio/dio.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final session = Supabase.instance.client.auth.currentSession;
    if (session != null) {
      options.headers['Authorization'] = 'Bearer ${session.accessToken}';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      try {
        final response = await Supabase.instance.client.auth.refreshSession();
        if (response.session != null) {
          err.requestOptions.headers['Authorization'] =
              'Bearer ${response.session!.accessToken}';
          final dio = Dio();
          final retryResponse = await dio.fetch(err.requestOptions);
          return handler.resolve(retryResponse);
        }
      } catch (_) {
        // Refresh failed, let the error propagate
      }
    }
    handler.next(err);
  }
}
