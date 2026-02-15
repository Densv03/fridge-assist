import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide User;
import '../../../../data/models/user.dart';
import '../../../../data/providers.dart';

part 'auth_provider.freezed.dart';

@freezed
class AuthState with _$AuthState {
  const factory AuthState.initial() = _Initial;
  const factory AuthState.loading() = _Loading;
  const factory AuthState.authenticated(User user) = _Authenticated;
  const factory AuthState.unauthenticated() = _Unauthenticated;
  const factory AuthState.needsOnboarding(User user) = _NeedsOnboarding;
  const factory AuthState.error(String message) = _Error;
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref);
});

class AuthNotifier extends StateNotifier<AuthState> {
  final Ref _ref;

  AuthNotifier(this._ref) : super(const AuthState.initial()) {
    _init();
  }

  Future<void> _init() async {
    state = const AuthState.loading();

    final session = Supabase.instance.client.auth.currentSession;
    if (session == null) {
      state = const AuthState.unauthenticated();
      return;
    }

    await _resolveUser();

    Supabase.instance.client.auth.onAuthStateChange.listen((data) {
      if (data.event == AuthChangeEvent.signedOut) {
        state = const AuthState.unauthenticated();
      } else if (data.event == AuthChangeEvent.signedIn) {
        _resolveUser();
      }
    });
  }

  Future<void> _resolveUser() async {
    try {
      state = const AuthState.loading();
      final authRepo = _ref.read(authRepositoryProvider);
      final user = await authRepo.getMe();
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signInWithEmail(String email, String password) async {
    try {
      state = const AuthState.loading();
      final authRepo = _ref.read(authRepositoryProvider);
      await authRepo.signInWithEmail(email, password);
      await _resolveUser();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signUpWithEmail(String email, String password) async {
    try {
      state = const AuthState.loading();
      final authRepo = _ref.read(authRepositoryProvider);
      await authRepo.signUpWithEmail(email, password);
      await _resolveUser();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signInWithGoogle() async {
    try {
      final authRepo = _ref.read(authRepositoryProvider);
      await authRepo.signInWithGoogle();
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<void> signOut() async {
    final authRepo = _ref.read(authRepositoryProvider);
    await authRepo.signOut();
    state = const AuthState.unauthenticated();
  }

  void completeOnboarding() {
    state.whenOrNull(
      needsOnboarding: (user) {
        state = AuthState.authenticated(user);
      },
    );
  }
}
