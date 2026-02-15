import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/glass_input.dart';
import '../../../../data/providers.dart';
import 'dart:convert';

class _ShoppingItem {
  String name;
  bool checked;
  _ShoppingItem({required this.name, this.checked = false});

  Map<String, dynamic> toJson() => {'name': name, 'checked': checked};
  factory _ShoppingItem.fromJson(Map<String, dynamic> json) =>
      _ShoppingItem(name: json['name'], checked: json['checked'] ?? false);
}

final _shoppingListProvider =
    StateNotifierProvider<_ShoppingListNotifier, List<_ShoppingItem>>((ref) {
  return _ShoppingListNotifier();
});

class _ShoppingListNotifier extends StateNotifier<List<_ShoppingItem>> {
  _ShoppingListNotifier() : super([]) {
    _load();
  }

  static const _key = 'shopping_list';

  Future<void> _load() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_key);
    if (raw != null) {
      final list = (jsonDecode(raw) as List)
          .map((e) => _ShoppingItem.fromJson(e))
          .toList();
      state = list;
    }
  }

  Future<void> _save() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, jsonEncode(state.map((e) => e.toJson()).toList()));
  }

  void add(String name) {
    state = [...state, _ShoppingItem(name: name)];
    _save();
  }

  void toggle(int index) {
    state = [
      for (int i = 0; i < state.length; i++)
        if (i == index)
          _ShoppingItem(name: state[i].name, checked: !state[i].checked)
        else
          state[i],
    ];
    _save();
  }

  void remove(int index) {
    state = [...state]..removeAt(index);
    _save();
  }

  List<_ShoppingItem> get checkedItems =>
      state.where((e) => e.checked).toList();

  void clearChecked() {
    state = state.where((e) => !e.checked).toList();
    _save();
  }
}

class ShoppingScreen extends ConsumerStatefulWidget {
  const ShoppingScreen({super.key});

  @override
  ConsumerState<ShoppingScreen> createState() => _ShoppingScreenState();
}

class _ShoppingScreenState extends ConsumerState<ShoppingScreen> {
  final _addController = TextEditingController();

  @override
  void dispose() {
    _addController.dispose();
    super.dispose();
  }

  void _addItem() {
    final name = _addController.text.trim();
    if (name.isEmpty) return;
    ref.read(_shoppingListProvider.notifier).add(name);
    _addController.clear();
  }

  Future<void> _transferToFridge() async {
    final notifier = ref.read(_shoppingListProvider.notifier);
    final checked = notifier.checkedItems;
    if (checked.isEmpty) return;

    final text = checked.map((e) => e.name).join(', ');
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final preview = await repo.previewText(text);
      await repo.confirm(preview.previewId);
      notifier.clearChecked();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content:
                  Text(AppLocalizations.of(context)!.confirmed)),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final items = ref.watch(_shoppingListProvider);
    final hasChecked = items.any((e) => e.checked);

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(l10n.shoppingList,
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold))
                .animate()
                .fadeIn(duration: 500.ms),
            const SizedBox(height: 16),

            // Add item
            Row(
              children: [
                Expanded(
                  child: GlassInput(
                    controller: _addController,
                    hintText: l10n.addToShoppingList,
                    onSubmitted: (_) => _addItem(),
                  ),
                ),
                const SizedBox(width: 8),
                GlassCard(
                  variant: GlassVariant.button,
                  borderRadius: 12,
                  padding: const EdgeInsets.all(12),
                  onTap: _addItem,
                  child: const Icon(Icons.add, color: AppColors.primary),
                ),
              ],
            )
                .animate(delay: 100.ms)
                .fadeIn(duration: 400.ms),
            const SizedBox(height: 16),

            // List
            Expanded(
              child: items.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text('🛒', style: TextStyle(fontSize: 48)),
                          const SizedBox(height: 12),
                          Text(l10n.emptyShoppingList,
                              style: TextStyle(color: AppColors.muted)),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: items.length,
                      itemBuilder: (context, index) {
                        final item = items[index];
                        return Dismissible(
                          key: Key('shopping_${index}_${item.name}'),
                          direction: DismissDirection.endToStart,
                          onDismissed: (_) {
                            ref
                                .read(_shoppingListProvider.notifier)
                                .remove(index);
                          },
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
                          child: GlassCard(
                            margin: const EdgeInsets.only(bottom: 8),
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            onTap: () => ref
                                .read(_shoppingListProvider.notifier)
                                .toggle(index),
                            child: Row(
                              children: [
                                GlassCard(
                                  variant: GlassVariant.subtle,
                                  borderRadius: 8,
                                  padding: const EdgeInsets.all(4),
                                  onTap: () => ref
                                      .read(_shoppingListProvider.notifier)
                                      .toggle(index),
                                  child: Icon(
                                    item.checked
                                        ? Icons.check_box
                                        : Icons.check_box_outline_blank,
                                    color: item.checked
                                        ? AppColors.primary
                                        : AppColors.muted,
                                    size: 22,
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    item.name,
                                    style: TextStyle(
                                      decoration: item.checked
                                          ? TextDecoration.lineThrough
                                          : null,
                                      color: item.checked
                                          ? AppColors.muted
                                          : AppColors.foreground,
                                    ),
                                  ),
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
            ),

            // Transfer button
            if (hasChecked)
              GlassCard(
                variant: GlassVariant.strong,
                borderRadius: 12,
                padding: EdgeInsets.zero,
                onTap: _transferToFridge,
                child: SizedBox(
                  height: 52,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text('🧊', style: TextStyle(fontSize: 20)),
                      const SizedBox(width: 8),
                      Text(
                        l10n.transferToFridge,
                        style: const TextStyle(
                          fontWeight: FontWeight.w600,
                          color: AppColors.primary,
                        ),
                      ),
                    ],
                  ),
                ),
              )
                  .animate()
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: 0.2, duration: 400.ms),
          ],
        ),
      ),
    );
  }
}
