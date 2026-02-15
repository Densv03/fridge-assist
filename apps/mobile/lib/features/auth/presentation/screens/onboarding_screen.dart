import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/gradient_background.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../providers/auth_provider.dart';

class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final _pageController = PageController();
  int _currentPage = 0;

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onNext() {
    if (_currentPage < 2) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 300),
        curve: Curves.easeInOut,
      );
    } else {
      _complete();
    }
  }

  void _complete() {
    ref.read(authProvider.notifier).completeOnboarding();
    context.go('/');
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    final pages = [
      _OnboardingPage(emoji: '📷', title: l10n.onboardingTitle1, description: l10n.onboardingDesc1),
      _OnboardingPage(emoji: '🍳', title: l10n.onboardingTitle2, description: l10n.onboardingDesc2),
      _OnboardingPage(emoji: '✅', title: l10n.onboardingTitle3, description: l10n.onboardingDesc3),
    ];

    return Scaffold(
      body: GradientBackground(
        showBubbles: true,
        child: SafeArea(
          child: Column(
            children: [
              // Skip button
              Align(
                alignment: Alignment.topRight,
                child: Padding(
                  padding: const EdgeInsets.only(right: 8, top: 8),
                  child: TextButton(
                    onPressed: _complete,
                    child: Text(
                      l10n.skip,
                      style: TextStyle(color: AppColors.muted),
                    ),
                  ),
                ),
              ),

              // Pages
              Expanded(
                child: PageView.builder(
                  controller: _pageController,
                  itemCount: pages.length,
                  onPageChanged: (index) {
                    setState(() => _currentPage = index);
                  },
                  itemBuilder: (context, index) => pages[index],
                ),
              ),

              // Dots
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  3,
                  (index) => AnimatedContainer(
                    duration: const Duration(milliseconds: 300),
                    margin: const EdgeInsets.symmetric(horizontal: 4),
                    width: _currentPage == index ? 32 : 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: _currentPage == index
                          ? AppColors.primary
                          : AppColors.primary.withValues(alpha: 0.2),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Button
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: ElevatedButton(
                  onPressed: _onNext,
                  child: Text(
                    _currentPage == 2 ? l10n.getStarted : l10n.next,
                  ),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}

class _OnboardingPage extends StatelessWidget {
  final String emoji;
  final String title;
  final String description;

  const _OnboardingPage({
    required this.emoji,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(40),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          GlassCard(
            variant: GlassVariant.strong,
            borderRadius: 24,
            padding: const EdgeInsets.all(28),
            child: Text(emoji, style: const TextStyle(fontSize: 56)),
          )
              .animate()
              .fadeIn(duration: 600.ms)
              .scale(begin: const Offset(0.8, 0.8), duration: 600.ms),
          const SizedBox(height: 40),
          Text(
            title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
            textAlign: TextAlign.center,
          )
              .animate(delay: 200.ms)
              .fadeIn(duration: 500.ms)
              .slideY(begin: 0.2, duration: 500.ms),
          const SizedBox(height: 16),
          Text(
            description,
            style: TextStyle(fontSize: 16, color: AppColors.muted),
            textAlign: TextAlign.center,
          )
              .animate(delay: 400.ms)
              .fadeIn(duration: 500.ms),
        ],
      ),
    );
  }
}
