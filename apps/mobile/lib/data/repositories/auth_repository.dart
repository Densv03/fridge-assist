import 'package:dio/dio.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/user.dart' as app;

class AuthRepository {
  final Dio _dio;
  final SupabaseClient _supabase;

  AuthRepository(this._dio) : _supabase = Supabase.instance.client;

  Future<AuthResponse> signInWithEmail(String email, String password) {
    return _supabase.auth.signInWithPassword(email: email, password: password);
  }

  Future<AuthResponse> signUpWithEmail(String email, String password) {
    return _supabase.auth.signUp(email: email, password: password);
  }

  Future<bool> signInWithGoogle() async {
    return _supabase.auth.signInWithOAuth(
      OAuthProvider.google,
      redirectTo: 'com.fridgeassist.mobile://callback',
    );
  }

  Future<void> signOut() {
    return _supabase.auth.signOut();
  }

  Session? get currentSession => _supabase.auth.currentSession;

  Stream<AuthState> get onAuthStateChange =>
      _supabase.auth.onAuthStateChange;

  Future<app.User> getMe() async {
    final response = await _dio.get('/auth/me');
    return app.User.fromJson(response.data);
  }
}
