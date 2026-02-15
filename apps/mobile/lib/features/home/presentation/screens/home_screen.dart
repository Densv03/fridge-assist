import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
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

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final inventoryAsync = ref.watch(_inventoryProvider);
    final isUa = ref.watch(localeProvider).languageCode == 'uk';

    return SafeArea(
      child: RefreshIndicator(
        onRefresh: () async {
          ref.invalidate(_inventoryProvider);
        },
        child: SingleChildScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 96),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Greeting
              Text(
                l10n.greeting(''),
                style: TextStyle(fontSize: 16, color: AppColors.muted),
              )
                  .animate()
                  .fadeIn(duration: 500.ms),
              const SizedBox(height: 4),
              Text(
                l10n.whatToCookToday,
                style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              )
                  .animate(delay: 100.ms)
                  .fadeIn(duration: 500.ms)
                  .slideX(begin: -0.1, duration: 500.ms),
              const SizedBox(height: 24),

              // Action buttons
              GlassCard(
                variant: GlassVariant.strong,
                onTap: () => context.go('/recipes'),
                child: Row(
                  children: [
                    const Text('🍳', style: TextStyle(fontSize: 32)),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.whatToCook,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            l10n.recipes,
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.muted),
                  ],
                ),
              )
                  .animate(delay: 200.ms)
                  .fadeIn(duration: 500.ms)
                  .slideY(begin: 0.2, duration: 500.ms),
              const SizedBox(height: 12),
              GlassCard(
                onTap: () => context.go('/add'),
                child: Row(
                  children: [
                    const Text('📷', style: TextStyle(fontSize: 32)),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            l10n.addProducts,
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                            ),
                          ),
                          Text(
                            l10n.addItems,
                            style: TextStyle(
                              fontSize: 13,
                              color: AppColors.muted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.muted),
                  ],
                ),
              )
                  .animate(delay: 300.ms)
                  .fadeIn(duration: 500.ms)
                  .slideY(begin: 0.2, duration: 500.ms),
              const SizedBox(height: 24),

              // Inventory data
              inventoryAsync.when(
                loading: () => const LoadingWidget(),
                error: (e, _) => AppErrorWidget(
                  message: e.toString(),
                  onRetry: () => ref.invalidate(_inventoryProvider),
                ),
                data: (items) {
                  final now = DateTime.now();
                  final expiring = items.where((item) {
                    if (item.expiresAt == null) return false;
                    final exp = DateTime.tryParse(item.expiresAt!);
                    if (exp == null) return false;
                    return exp.difference(now).inDays <= 3 && exp.isAfter(now);
                  }).toList();

                  final recent = List<InventoryItem>.from(items)
                    ..sort((a, b) => b.createdAt.compareTo(a.createdAt));
                  final recentItems = recent.take(4).toList();

                  return Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (expiring.isNotEmpty) ...[
                        Text(
                          l10n.expiringItems,
                          style: Theme.of(context)
                              .textTheme
                              .titleMedium
                              ?.copyWith(fontWeight: FontWeight.bold),
                        )
                            .animate(delay: 400.ms)
                            .fadeIn(duration: 500.ms),
                        const SizedBox(height: 12),
                        SizedBox(
                          height: 110,
                          child: ListView.separated(
                            scrollDirection: Axis.horizontal,
                            itemCount: expiring.length,
                            separatorBuilder: (_, __) =>
                                const SizedBox(width: 12),
                            itemBuilder: (context, index) {
                              final item = expiring[index];
                              final name = isUa
                                  ? (item.masterIngredients.canonicalNameUa ??
                                      item.masterIngredients.canonicalName)
                                  : item.masterIngredients.canonicalName;
                              final exp =
                                  DateTime.tryParse(item.expiresAt ?? '');
                              final days = exp != null
                                  ? exp.difference(now).inDays
                                  : 0;
                              final emoji = categoryEmoji(
                                  item.masterIngredients.category);
                              return GlassCard(
                                variant: GlassVariant.strong,
                                padding: const EdgeInsets.all(12),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(emoji,
                                        style: const TextStyle(fontSize: 24)),
                                    const SizedBox(height: 4),
                                    Text(name,
                                        style: const TextStyle(
                                            fontWeight: FontWeight.w600,
                                            fontSize: 13)),
                                    const SizedBox(height: 4),
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                          horizontal: 6, vertical: 2),
                                      decoration: BoxDecoration(
                                        color: (days <= 1
                                                ? AppColors.error
                                                : AppColors.warning)
                                            .withValues(alpha: 0.15),
                                        borderRadius:
                                            BorderRadius.circular(6),
                                      ),
                                      child: Text(
                                        l10n.expiresIn(days),
                                        style: TextStyle(
                                          fontSize: 11,
                                          color: days <= 1
                                              ? AppColors.error
                                              : AppColors.warning,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              )
                                  .animate(delay: (500 + index * 100).ms)
                                  .fadeIn(duration: 400.ms)
                                  .slideX(begin: 0.2, duration: 400.ms);
                            },
                          ),
                        ),
                        const SizedBox(height: 24),
                      ],

                      Text(
                        l10n.recentAdditions,
                        style: Theme.of(context)
                            .textTheme
                            .titleMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                      )
                          .animate(delay: 600.ms)
                          .fadeIn(duration: 500.ms),
                      const SizedBox(height: 12),

                      if (recentItems.isEmpty)
                        GlassCard(
                          child: Center(
                            child: Column(
                              children: [
                                const Text('🧊',
                                    style: TextStyle(fontSize: 48)),
                                const SizedBox(height: 8),
                                Text(l10n.emptyFridge),
                                Text(l10n.emptyFridgeDesc,
                                    style: TextStyle(
                                        color: AppColors.muted,
                                        fontSize: 13)),
                              ],
                            ),
                          ),
                        )
                      else
                        ...recentItems.asMap().entries.map((entry) {
                          final item = entry.value;
                          final name = isUa
                              ? (item.masterIngredients.canonicalNameUa ??
                                  item.masterIngredients.canonicalName)
                              : item.masterIngredients.canonicalName;
                          final emoji = categoryEmoji(
                              item.masterIngredients.category);
                          return GlassCard(
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
                                      style:
                                          const TextStyle(fontSize: 20)),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(name,
                                      style: const TextStyle(
                                          fontWeight: FontWeight.w500)),
                                ),
                                Text(
                                  '${item.quantity} ${item.unit}',
                                  style: TextStyle(color: AppColors.muted),
                                ),
                              ],
                            ),
                          )
                              .animate(delay: (700 + entry.key * 80).ms)
                              .fadeIn(duration: 400.ms)
                              .slideY(begin: 0.1, duration: 400.ms);
                        }),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
