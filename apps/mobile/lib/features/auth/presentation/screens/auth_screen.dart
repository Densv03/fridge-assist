import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/gradient_background.dart';
import '../../../../shared/widgets/gradient_text.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/glass_input.dart';
import '../providers/auth_provider.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isSignUp = false;
  bool _obscurePassword = true;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    if (!_formKey.currentState!.validate()) return;

    final email = _emailController.text.trim();
    final password = _passwordController.text;

    if (_isSignUp) {
      ref.read(authProvider.notifier).signUpWithEmail(email, password);
    } else {
      ref.read(authProvider.notifier).signInWithEmail(email, password);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final authState = ref.watch(authProvider);
    final isLoading = authState.maybeWhen(loading: () => true, orElse: () => false);

    return Scaffold(
      body: GradientBackground(
        showBubbles: true,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 48),
                // Logo
                Center(
                  child: GlassCard(
                    variant: GlassVariant.strong,
                    borderRadius: 24,
                    padding: const EdgeInsets.all(20),
                    child: const Text('🧊', style: TextStyle(fontSize: 48)),
                  ),
                )
                    .animate()
                    .fadeIn(duration: 600.ms)
                    .scale(begin: const Offset(0.8, 0.8), duration: 600.ms),
                const SizedBox(height: 20),
                Center(child: const GradientText('FridgeChef'))
                    .animate(delay: 200.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 8),
                Text(
                  _isSignUp ? l10n.signUp : l10n.signIn,
                  style: TextStyle(color: AppColors.muted, fontSize: 16),
                  textAlign: TextAlign.center,
                )
                    .animate(delay: 300.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 32),

                // Form card
                GlassCard(
                  variant: GlassVariant.strong,
                  borderRadius: 24,
                  padding: const EdgeInsets.all(24),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      children: [
                        GlassInput(
                          controller: _emailController,
                          hintText: l10n.email,
                          prefixIcon: Icons.email_outlined,
                          keyboardType: TextInputType.emailAddress,
                          validator: (value) {
                            if (value == null || value.isEmpty) return 'Required';
                            if (!value.contains('@')) return 'Invalid email';
                            return null;
                          },
                        ),
                        const SizedBox(height: 16),
                        GlassInput(
                          controller: _passwordController,
                          hintText: l10n.password,
                          prefixIcon: Icons.lock_outlined,
                          obscureText: _obscurePassword,
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword
                                  ? Icons.visibility_outlined
                                  : Icons.visibility_off_outlined,
                              color: AppColors.muted,
                            ),
                            onPressed: () {
                              setState(() => _obscurePassword = !_obscurePassword);
                            },
                          ),
                          validator: (value) {
                            if (value == null || value.isEmpty) return 'Required';
                            if (value.length < 6) return 'Min 6 characters';
                            return null;
                          },
                        ),
                        const SizedBox(height: 24),

                        // Error message
                        authState.whenOrNull(
                              error: (message) => Padding(
                                padding: const EdgeInsets.only(bottom: 16),
                                child: Text(
                                  message,
                                  style: const TextStyle(color: AppColors.error),
                                  textAlign: TextAlign.center,
                                ),
                              ),
                            ) ??
                            const SizedBox.shrink(),

                        // Submit button
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: isLoading ? null : _submit,
                            child: isLoading
                                ? const SizedBox(
                                    height: 20,
                                    width: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      color: Colors.white,
                                    ),
                                  )
                                : Text(_isSignUp ? l10n.signUp : l10n.signIn),
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                    .animate(delay: 400.ms)
                    .fadeIn(duration: 600.ms)
                    .slideY(begin: 0.2, duration: 600.ms),
                const SizedBox(height: 20),

                // Divider
                Row(
                  children: [
                    Expanded(child: Divider(color: AppColors.muted.withValues(alpha: 0.3))),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Text(l10n.orDivider, style: TextStyle(color: AppColors.muted)),
                    ),
                    Expanded(child: Divider(color: AppColors.muted.withValues(alpha: 0.3))),
                  ],
                )
                    .animate(delay: 500.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 20),

                // Google sign in
                GlassCard(
                  variant: GlassVariant.button,
                  borderRadius: 12,
                  padding: EdgeInsets.zero,
                  onTap: () => ref.read(authProvider.notifier).signInWithGoogle(),
                  child: SizedBox(
                    height: 52,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.g_mobiledata, size: 24, color: AppColors.foreground),
                        const SizedBox(width: 8),
                        Text(
                          l10n.continueWithGoogle,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.foreground,
                          ),
                        ),
                      ],
                    ),
                  ),
                )
                    .animate(delay: 600.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 24),

                // Toggle sign in/up
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      _isSignUp ? l10n.haveAccount : l10n.noAccount,
                      style: TextStyle(color: AppColors.muted),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() => _isSignUp = !_isSignUp);
                      },
                      child: Text(
                        _isSignUp ? l10n.signIn : l10n.signUp,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.primary,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
