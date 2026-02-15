import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/gradient_text.dart';
import '../../../../data/providers.dart';
import '../../../auth/presentation/providers/auth_provider.dart';
import '../providers/locale_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final l10n = AppLocalizations.of(context)!;
    final locale = ref.watch(localeProvider);
    final authState = ref.watch(authProvider);

    final userName = authState.whenOrNull(
          authenticated: (user) => user.name,
        ) ??
        '';
    final userEmail = authState.whenOrNull(
          authenticated: (user) => user.email,
        ) ??
        '';
    final userId = authState.whenOrNull(
          authenticated: (user) => user.id,
        );

    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(l10n.settings,
                style: Theme.of(context)
                    .textTheme
                    .headlineSmall
                    ?.copyWith(fontWeight: FontWeight.bold))
                .animate()
                .fadeIn(duration: 500.ms),
            const SizedBox(height: 24),

            // Premium promo card
            GlassCard(
              variant: GlassVariant.strong,
              onTap: () => context.go('/subscription'),
              child: Row(
                children: [
                  const Text('👑', style: TextStyle(fontSize: 32)),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GradientText(
                          l10n.premiumTitle,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          l10n.premiumSubtitle,
                          style: TextStyle(
                            fontSize: 13,
                            color: AppColors.muted,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      l10n.learnMore,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ],
              ),
            )
                .animate(delay: 100.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.15, duration: 500.ms),
            const SizedBox(height: 24),

            // Account section
            Text(l10n.account,
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
                children: [
                  if (userName.isNotEmpty)
                    _SettingsRow(
                      icon: Icons.person_outline,
                      label: userName,
                    ),
                  if (userEmail.isNotEmpty) ...[
                    if (userName.isNotEmpty)
                      Divider(color: Colors.white.withValues(alpha: 0.2), height: 1),
                    _SettingsRow(
                      icon: Icons.email_outlined,
                      label: userEmail,
                    ),
                  ],
                ],
              ),
            )
                .animate(delay: 300.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.1, duration: 500.ms),
            const SizedBox(height: 24),

            // Language section
            Text(l10n.language,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold))
                .animate(delay: 400.ms)
                .fadeIn(duration: 400.ms),
            const SizedBox(height: 12),
            GlassCard(
              variant: GlassVariant.strong,
              child: Column(
                children: [
                  _SettingsRow(
                    icon: Icons.language,
                    label: l10n.english,
                    trailing: Radio<Locale>(
                      value: const Locale('en'),
                      groupValue: locale,
                      onChanged: (value) async {
                        if (value == null) return;
                        ref.read(localeProvider.notifier).setLocale(value);
                        if (userId != null) {
                          try {
                            final repo = ref.read(userRepositoryProvider);
                            await repo.updatePreferredLanguage(userId, 'en');
                          } catch (_) {}
                        }
                      },
                      activeColor: AppColors.primary,
                    ),
                    onTap: () async {
                      ref.read(localeProvider.notifier).setLocale(const Locale('en'));
                      if (userId != null) {
                        try {
                          final repo = ref.read(userRepositoryProvider);
                          await repo.updatePreferredLanguage(userId, 'en');
                        } catch (_) {}
                      }
                    },
                  ),
                  Divider(color: Colors.white.withValues(alpha: 0.2), height: 1),
                  _SettingsRow(
                    icon: Icons.language,
                    label: l10n.ukrainian,
                    trailing: Radio<Locale>(
                      value: const Locale('uk'),
                      groupValue: locale,
                      onChanged: (value) async {
                        if (value == null) return;
                        ref.read(localeProvider.notifier).setLocale(value);
                        if (userId != null) {
                          try {
                            final repo = ref.read(userRepositoryProvider);
                            await repo.updatePreferredLanguage(userId, 'ua');
                          } catch (_) {}
                        }
                      },
                      activeColor: AppColors.primary,
                    ),
                    onTap: () async {
                      ref.read(localeProvider.notifier).setLocale(const Locale('uk'));
                      if (userId != null) {
                        try {
                          final repo = ref.read(userRepositoryProvider);
                          await repo.updatePreferredLanguage(userId, 'ua');
                        } catch (_) {}
                      }
                    },
                  ),
                ],
              ),
            )
                .animate(delay: 500.ms)
                .fadeIn(duration: 500.ms)
                .slideY(begin: 0.1, duration: 500.ms),
            const SizedBox(height: 24),

            // Sign out
            GlassCard(
              variant: GlassVariant.strong,
              onTap: () async {
                final confirmed = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: Text(l10n.signOutConfirm),
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
                if (confirmed == true) {
                  ref.read(authProvider.notifier).signOut();
                }
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.logout, color: AppColors.error, size: 20),
                  const SizedBox(width: 8),
                  Text(l10n.signOut,
                      style: const TextStyle(
                          color: AppColors.error, fontWeight: FontWeight.w600)),
                ],
              ),
            )
                .animate(delay: 600.ms)
                .fadeIn(duration: 500.ms),
          ],
        ),
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final Widget? trailing;
  final VoidCallback? onTap;

  const _SettingsRow({
    required this.icon,
    required this.label,
    this.trailing,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 4),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.muted),
            const SizedBox(width: 12),
            Expanded(
              child: Text(label, style: const TextStyle(fontSize: 15)),
            ),
            if (trailing != null) trailing!,
            if (trailing == null && onTap != null)
              const Icon(Icons.chevron_right, size: 20, color: AppColors.muted),
          ],
        ),
      ),
    );
  }
}
