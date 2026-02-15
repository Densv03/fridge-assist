import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../../../shared/widgets/error_widget.dart';
import '../../../../data/providers.dart';
import '../../../../data/models/recipe.dart';
import '../../../settings/presentation/providers/locale_provider.dart';

final _suggestionsProvider =
    FutureProvider<RecipeSuggestionsResponse>((ref) async {
  final repo = ref.watch(recipeRepositoryProvider);
  return repo.getSuggestions();
});

class RecipesScreen extends ConsumerWidget {
  const RecipesScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final suggestionsAsync = ref.watch(_suggestionsProvider);
    final isUa = ref.watch(localeProvider).languageCode == 'uk';

    return SafeArea(
      child: suggestionsAsync.when(
        loading: () => const LoadingWidget(),
        error: (e, _) => AppErrorWidget(
          message: e.toString(),
          onRetry: () => ref.invalidate(_suggestionsProvider),
        ),
        data: (response) {
          if (response.emptyFridge) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('🍳', style: TextStyle(fontSize: 64)),
                  const SizedBox(height: 16),
                  Text(l10n.noRecipes),
                  Text(l10n.noRecipesDesc,
                      style: TextStyle(color: AppColors.muted)),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(_suggestionsProvider),
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  if (response.canCook.isNotEmpty) ...[
                    Text(
                      l10n.canCookNow,
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.bold),
                    )
                        .animate()
                        .fadeIn(duration: 400.ms),
                    const SizedBox(height: 12),
                    ...response.canCook.asMap().entries.map(
                        (e) => _RecipeCard(recipe: e.value, isUa: isUa, index: e.key)),
                  ],
                  if (response.needToBuy.isNotEmpty) ...[
                    const SizedBox(height: 24),
                    Text(
                      l10n.needToBuy,
                      style: Theme.of(context)
                          .textTheme
                          .titleMedium
                          ?.copyWith(fontWeight: FontWeight.bold),
                    )
                        .animate(delay: 300.ms)
                        .fadeIn(duration: 400.ms),
                    const SizedBox(height: 12),
                    ...response.needToBuy.asMap().entries.map(
                        (e) => _RecipeCard(
                            recipe: e.value,
                            isUa: isUa,
                            index: e.key + response.canCook.length)),
                  ],
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _RecipeCard extends StatelessWidget {
  final RecipeSuggestion recipe;
  final bool isUa;
  final int index;

  const _RecipeCard({required this.recipe, required this.isUa, required this.index});

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final name = isUa ? recipe.dishNameUa : recipe.dishNameEn;
    final hasMissing = recipe.missingIngredients != null &&
        recipe.missingIngredients!.isNotEmpty;

    return GlassCard(
      variant: GlassVariant.strong,
      margin: const EdgeInsets.only(bottom: 12),
      onTap: () {
        context.go('/recipe/${Uri.encodeComponent(recipe.dishNameEn)}');
      },
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text('🍽️', style: TextStyle(fontSize: 28)),
              const SizedBox(width: 12),
              Expanded(
                child: Text(name,
                    style: const TextStyle(
                        fontWeight: FontWeight.w600, fontSize: 16)),
              ),
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  recipe.category,
                  style: const TextStyle(
                      fontSize: 11,
                      color: AppColors.primary,
                      fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
          if (hasMissing) ...[
            const SizedBox(height: 8),
            Wrap(
              spacing: 6,
              runSpacing: 4,
              children: recipe.missingIngredients!.map((m) {
                final mName = isUa ? m.nameUa : m.nameEn;
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                  decoration: BoxDecoration(
                    color: AppColors.warning.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: Text(
                    mName,
                    style: const TextStyle(
                        fontSize: 11,
                        color: AppColors.warning,
                        fontWeight: FontWeight.w500),
                  ),
                );
              }).toList(),
            ),
          ],
          const SizedBox(height: 12),
          Row(
            children: [
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    context.go('/recipe/${Uri.encodeComponent(recipe.dishNameEn)}');
                  },
                  style: ElevatedButton.styleFrom(
                    minimumSize: const Size(0, 40),
                  ),
                  child: Text(l10n.cookThis),
                ),
              ),
              if (hasMissing) ...[
                const SizedBox(width: 8),
                Expanded(
                  child: GlassCard(
                    variant: GlassVariant.button,
                    borderRadius: 12,
                    padding: EdgeInsets.zero,
                    onTap: () {},
                    child: SizedBox(
                      height: 40,
                      child: Center(
                        child: Text(
                          l10n.buyMissing,
                          style: const TextStyle(
                            fontWeight: FontWeight.w600,
                            color: AppColors.foreground,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ],
          ),
        ],
      ),
    )
        .animate(delay: (200 + index * 100).ms)
        .fadeIn(duration: 500.ms)
        .slideY(begin: 0.15, duration: 500.ms);
  }
}
