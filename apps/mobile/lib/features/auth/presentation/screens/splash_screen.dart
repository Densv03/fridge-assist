import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/gradient_background.dart';
import '../../../../shared/widgets/gradient_text.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(milliseconds: 2500), () {
      if (mounted) _navigate();
    });
  }

  void _navigate() {
    final authState = ref.read(authProvider);
    authState.when(
      initial: () {},
      loading: () {},
      authenticated: (_) => context.go('/'),
      unauthenticated: () => context.go('/auth'),
      needsOnboarding: (_) => context.go('/onboarding'),
      error: (_) => context.go('/auth'),
    );
  }

  @override
  Widget build(BuildContext context) {
    ref.listen<AuthState>(authProvider, (prev, next) {
      next.whenOrNull(
        authenticated: (_) => context.go('/'),
        unauthenticated: () => context.go('/auth'),
        needsOnboarding: (_) => context.go('/onboarding'),
        error: (_) => context.go('/auth'),
      );
    });

    return Scaffold(
      body: GradientBackground(
        showBubbles: true,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              GlassCard(
                variant: GlassVariant.strong,
                borderRadius: 24,
                padding: const EdgeInsets.all(24),
                child: const Text(
                  '🧊',
                  style: TextStyle(fontSize: 56),
                ),
              )
                  .animate()
                  .fadeIn(duration: 600.ms)
                  .scale(begin: const Offset(0.8, 0.8), duration: 800.ms, curve: Curves.elasticOut),
              const SizedBox(height: 24),
              const GradientText('FridgeChef')
                  .animate(delay: 300.ms)
                  .fadeIn(duration: 600.ms)
                  .slideY(begin: 0.3, duration: 600.ms),
              const SizedBox(height: 8),
              Text(
                'Your smart kitchen companion',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.muted,
                ),
              )
                  .animate(delay: 500.ms)
                  .fadeIn(duration: 600.ms),
            ],
          ),
        ),
      ),
    );
  }
}
