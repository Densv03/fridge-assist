import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../core/theme/app_colors.dart';

class BottomNav extends StatelessWidget {
  const BottomNav({super.key});

  int _currentIndex(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location == '/') return 0;
    if (location == '/fridge') return 1;
    if (location == '/recipes' || location.startsWith('/recipe/')) return 2;
    if (location == '/shopping') return 3;
    if (location == '/settings') return 4;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final currentIndex = _currentIndex(context);

    final items = [
      _NavItem(Icons.home_outlined, Icons.home, l10n.home, '/'),
      _NavItem(Icons.ac_unit_outlined, Icons.ac_unit, l10n.fridge, '/fridge'),
      _NavItem(Icons.restaurant_outlined, Icons.restaurant, l10n.recipes, '/recipes'),
      _NavItem(Icons.shopping_cart_outlined, Icons.shopping_cart, l10n.shoppingList, '/shopping'),
      _NavItem(Icons.settings_outlined, Icons.settings, l10n.settings, '/settings'),
    ];

    return SafeArea(
      top: false,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: BackdropFilter(
            filter: ImageFilter.blur(
              sigmaX: AppColors.glassStrongBlur,
              sigmaY: AppColors.glassStrongBlur,
            ),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: AppColors.glassStrongBgOpacity),
                borderRadius: BorderRadius.circular(24),
                border: Border.all(
                  color: Colors.white.withValues(alpha: AppColors.glassStrongBorderOpacity),
                ),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: List.generate(items.length, (index) {
                  final item = items[index];
                  final isActive = currentIndex == index;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => context.go(item.path),
                      behavior: HitTestBehavior.opaque,
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isActive ? item.activeIcon : item.icon,
                            color: isActive ? AppColors.primary : AppColors.muted,
                            size: 22,
                          ),
                          const SizedBox(height: 2),
                          Text(
                            item.label,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
                              color: isActive ? AppColors.primary : AppColors.muted,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final String path;

  const _NavItem(this.icon, this.activeIcon, this.label, this.path);
}
