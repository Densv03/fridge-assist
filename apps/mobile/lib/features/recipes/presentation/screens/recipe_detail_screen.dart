import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../../../shared/widgets/error_widget.dart';
import '../../../../data/providers.dart';
import '../../../../data/models/recipe.dart';
import '../../../settings/presentation/providers/locale_provider.dart';

class RecipeDetailScreen extends ConsumerStatefulWidget {
  final String dishName;

  const RecipeDetailScreen({super.key, required this.dishName});

  @override
  ConsumerState<RecipeDetailScreen> createState() => _RecipeDetailScreenState();
}

class _RecipeDetailScreenState extends ConsumerState<RecipeDetailScreen> {
  RecipeDetail? _detail;
  bool _isLoading = true;
  bool _isConsuming = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loadDetail();
  }

  Future<void> _loadDetail() async {
    try {
      final repo = ref.read(recipeRepositoryProvider);
      final detail = await repo.getDetail([widget.dishName]);
      if (mounted) setState(() { _detail = detail; _isLoading = false; });
    } catch (e) {
      if (mounted) setState(() { _error = e.toString(); _isLoading = false; });
    }
  }

  Future<void> _consume() async {
    setState(() => _isConsuming = true);
    try {
      final repo = ref.read(recipeRepositoryProvider);
      await repo.consume([widget.dishName]);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(AppLocalizations.of(context)!.consumed)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _isConsuming = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final isUa = ref.watch(localeProvider).languageCode == 'uk';

    if (_isLoading) return const Scaffold(body: LoadingWidget());
    if (_error != null) {
      return Scaffold(
        body: AppErrorWidget(message: _error, onRetry: _loadDetail),
      );
    }

    final detail = _detail!;
    final name = isUa ? detail.dishNameUa : detail.dishNameEn;

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Back button
            GlassCard(
              variant: GlassVariant.subtle,
              borderRadius: 12,
              padding: const EdgeInsets.all(8),
              onTap: () => context.pop(),
              child: const Icon(Icons.arrow_back, size: 20, color: AppColors.foreground),
            )
                .animate()
                .fadeIn(duration: 300.ms),
            const SizedBox(height: 16),

            // Hero card
            GlassCard(
              variant: GlassVariant.strong,
              borderRadius: 20,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Text('🍽️', style: TextStyle(fontSize: 40)),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Text(name,
                            style: Theme.of(context)
                                .textTheme
                                .headlineSmall
                                ?.copyWith(fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      const Icon(Icons.people_outline, size: 18, color: AppColors.muted),
                      const SizedBox(width: 4),
                      Text(l10n.servings(detail.servings),
                          style: TextStyle(color: AppColors.muted)),
                      const SizedBox(width: 16),
                      const Icon(Icons.timer_outlined, size: 18, color: AppColors.muted),
                      const SizedBox(width: 4),
                      Text(l10n.cookTime(detail.cookTimeMinutes),
                          style: TextStyle(color: AppColors.muted)),
                    ],
                  ),
                ],
              ),
            )
                .animate(delay: 100.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.15, duration: 500.ms),
            const SizedBox(height: 24),

            // Ingredients
            Text(l10n.ingredients,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold))
                .animate(delay: 200.ms)
                .fadeIn(duration: 400.ms),
            const SizedBox(height: 12),
            GlassCard(
              variant: GlassVariant.strong,
              child: Column(
                children: detail.ingredients.map((ing) {
                  final ingName = isUa ? ing.nameUa : ing.nameEn;
                  final qty = isUa ? ing.quantityUa : ing.quantity;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      children: [
                        Icon(
                          Icons.check_circle_outline,
                          size: 18,
                          color: AppColors.primary,
                        ),
                        const SizedBox(width: 8),
                        Expanded(child: Text(ingName)),
                        Text(qty, style: TextStyle(color: AppColors.muted)),
                      ],
                    ),
                  );
                }).toList(),
              ),
            )
                .animate(delay: 300.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.1, duration: 500.ms),
            const SizedBox(height: 24),

            // Steps
            Text(l10n.steps,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold))
                .animate(delay: 400.ms)
                .fadeIn(duration: 400.ms),
            const SizedBox(height: 12),
            ...detail.steps.asMap().entries.map((entry) {
              final step = entry.value;
              final stepText = isUa ? step.stepUa : step.stepEn;
              return GlassCard(
                margin: const EdgeInsets.only(bottom: 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 28,
                      height: 28,
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text('${entry.key + 1}',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 13,
                                fontWeight: FontWeight.w600)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(child: Text(stepText)),
                  ],
                ),
              )
                  .animate(delay: (500 + entry.key * 80).ms)
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: 0.1, duration: 400.ms);
            }),
            const SizedBox(height: 24),

            // Consume button
            ElevatedButton(
              onPressed: _isConsuming ? null : _consume,
              child: _isConsuming
                  ? const SizedBox(
                      height: 20,
                      width: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : Text(l10n.consumeIngredients),
            )
                .animate(delay: 700.ms)
                .fadeIn(duration: 400.ms),
          ],
        ),
      ),
    );
  }
}
