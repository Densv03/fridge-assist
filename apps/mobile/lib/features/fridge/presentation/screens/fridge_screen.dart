import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/glass_input.dart';
import '../../../../shared/widgets/loading_widget.dart';
import '../../../../shared/widgets/error_widget.dart';
import '../../../../shared/utils/category_emoji.dart';
import '../../../../data/providers.dart';
import '../../../../data/models/inventory_item.dart';
import '../../../settings/presentation/providers/locale_provider.dart';

final _inventoryProvider = FutureProvider<List<InventoryItem>>((ref) async {
  final repo = ref.watch(inventoryRepositoryProvider);
  return repo.getAll();
});

final _searchQueryProvider = StateProvider<String>((ref) => '');
final _selectedCategoryProvider = StateProvider<String?>((ref) => null);

class FridgeScreen extends ConsumerWidget {
  const FridgeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final inventoryAsync = ref.watch(_inventoryProvider);
    final searchQuery = ref.watch(_searchQueryProvider);
    final selectedCategory = ref.watch(_selectedCategoryProvider);
    final isUa = ref.watch(localeProvider).languageCode == 'uk';

    final categories = [
      (null, l10n.allCategories, '🍽️'),
      ('Meat & Poultry', l10n.meat, '🥩'),
      ('Dairy & Eggs', l10n.dairy, '🧀'),
      ('Vegetables', l10n.vegetables, '🥬'),
      ('Fruits', l10n.fruits, '🍎'),
      ('Grains & Pasta', l10n.grains, '🌾'),
      ('Other', l10n.other, '📦'),
    ];

    return SafeArea(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: GlassInput(
              hintText: l10n.searchHint,
              prefixIcon: Icons.search,
              onChanged: (v) =>
                  ref.read(_searchQueryProvider.notifier).state = v,
            ),
          )
              .animate()
              .fadeIn(duration: 400.ms),

          // Category chips
          SizedBox(
            height: 44,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final (catKey, catLabel, catEmoji) = categories[index];
                final isSelected = selectedCategory == catKey;
                return GlassCard(
                  variant: isSelected ? GlassVariant.button : GlassVariant.subtle,
                  borderRadius: 20,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  onTap: () {
                    ref.read(_selectedCategoryProvider.notifier).state = catKey;
                  },
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(catEmoji, style: const TextStyle(fontSize: 14)),
                      const SizedBox(width: 6),
                      Text(
                        catLabel,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                          color: isSelected ? AppColors.primary : AppColors.foreground,
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          )
              .animate(delay: 100.ms)
              .fadeIn(duration: 400.ms),
          const SizedBox(height: 8),

          // Inventory list
          Expanded(
            child: inventoryAsync.when(
              loading: () => const LoadingWidget(),
              error: (e, _) => AppErrorWidget(
                message: e.toString(),
                onRetry: () => ref.invalidate(_inventoryProvider),
              ),
              data: (items) {
                var filtered = items;

                if (selectedCategory != null) {
                  filtered = filtered
                      .where((i) =>
                          i.masterIngredients.category == selectedCategory)
                      .toList();
                }

                if (searchQuery.isNotEmpty) {
                  final q = searchQuery.toLowerCase();
                  filtered = filtered.where((i) {
                    final name =
                        i.masterIngredients.canonicalName.toLowerCase();
                    final nameUa =
                        i.masterIngredients.canonicalNameUa?.toLowerCase() ??
                            '';
                    return name.contains(q) || nameUa.contains(q);
                  }).toList();
                }

                if (filtered.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('🧊', style: TextStyle(fontSize: 64)),
                        const SizedBox(height: 16),
                        Text(l10n.emptyFridge),
                        Text(l10n.emptyFridgeDesc,
                            style: TextStyle(color: AppColors.muted)),
                      ],
                    ),
                  );
                }

                return RefreshIndicator(
                  onRefresh: () async {
                    ref.invalidate(_inventoryProvider);
                  },
                  child: ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 96),
                    itemCount: filtered.length,
                    itemBuilder: (context, index) {
                      final item = filtered[index];
                      final name = isUa
                          ? (item.masterIngredients.canonicalNameUa ??
                              item.masterIngredients.canonicalName)
                          : item.masterIngredients.canonicalName;
                      final emoji =
                          categoryEmoji(item.masterIngredients.category);

                      final now = DateTime.now();
                      final expires = item.expiresAt != null
                          ? DateTime.tryParse(item.expiresAt!)
                          : null;
                      final isExpired =
                          expires != null && expires.isBefore(now);
                      final isExpiringSoon = expires != null &&
                          !isExpired &&
                          expires.difference(now).inDays <= 3;

                      return Dismissible(
                        key: Key(item.id),
                        direction: DismissDirection.endToStart,
                        background: Container(
                          alignment: Alignment.centerRight,
                          padding: const EdgeInsets.only(right: 20),
                          margin: const EdgeInsets.only(bottom: 8),
                          decoration: BoxDecoration(
                            color: AppColors.error.withValues(alpha: 0.15),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(Icons.delete, color: AppColors.error),
                        ),
                        confirmDismiss: (_) async {
                          return await showDialog<bool>(
                            context: context,
                            builder: (ctx) => AlertDialog(
                              title: Text(l10n.deleteConfirm),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx, false),
                                  child: Text(l10n.no),
                                ),
                                TextButton(
                                  onPressed: () => Navigator.pop(ctx, true),
                                  child: Text(l10n.yes),
                                ),
                              ],
                            ),
                          );
                        },
                        onDismissed: (_) async {
                          final repo = ref.read(inventoryRepositoryProvider);
                          await repo.delete(item.id);
                          ref.invalidate(_inventoryProvider);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text(l10n.itemDeleted)),
                            );
                          }
                        },
                        child: GlassCard(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 16, vertical: 12),
                          child: Row(
                            children: [
                              GlassCard(
                                variant: GlassVariant.subtle,
                                borderRadius: 10,
                                padding: const EdgeInsets.all(8),
                                child: Text(emoji,
                                    style: const TextStyle(fontSize: 20)),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(name,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 15)),
                                    const SizedBox(height: 2),
                                    Text(
                                      '${item.quantity} ${item.unit}',
                                      style: TextStyle(
                                          color: AppColors.muted,
                                          fontSize: 13),
                                    ),
                                  ],
                                ),
                              ),
                              if (isExpired)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.error.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(l10n.expired,
                                      style: const TextStyle(
                                          color: AppColors.error,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500)),
                                )
                              else if (isExpiringSoon)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.warning.withValues(alpha: 0.1),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                      l10n.expiresIn(
                                          expires.difference(now).inDays),
                                      style: const TextStyle(
                                          color: AppColors.warning,
                                          fontSize: 12,
                                          fontWeight: FontWeight.w500)),
                                ),
                            ],
                          ),
                        ),
                      )
                          .animate(delay: (200 + index * 60).ms)
                          .fadeIn(duration: 400.ms)
                          .slideY(begin: 0.1, duration: 400.ms);
                    },
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
