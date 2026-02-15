import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/gradient_background.dart';
import '../../../../shared/widgets/gradient_text.dart';
import '../../../../shared/widgets/glass_card.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  State<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  int _selectedPlan = 1; // 0=monthly, 1=yearly, 2=lifetime

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    final benefits = [
      (Icons.restaurant_menu, l10n.subscriptionBenefit1),
      (Icons.smart_toy_outlined, l10n.subscriptionBenefit2),
      (Icons.inventory_2_outlined, l10n.subscriptionBenefit3),
      (Icons.sync, l10n.subscriptionBenefit4),
      (Icons.analytics_outlined, l10n.subscriptionBenefit5),
      (Icons.support_agent_outlined, l10n.subscriptionBenefit6),
      (Icons.block, l10n.subscriptionBenefit7),
    ];

    return Scaffold(
      body: GradientBackground(
        showBubbles: true,
        child: SafeArea(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
            child: Column(
              children: [
                // Back button
                Align(
                  alignment: Alignment.topLeft,
                  child: GlassCard(
                    variant: GlassVariant.subtle,
                    borderRadius: 12,
                    padding: const EdgeInsets.all(8),
                    onTap: () => Navigator.of(context).pop(),
                    child: const Icon(Icons.arrow_back, size: 20, color: AppColors.foreground),
                  ),
                )
                    .animate()
                    .fadeIn(duration: 300.ms),
                const SizedBox(height: 24),

                // Hero
                const Text('👑', style: TextStyle(fontSize: 56))
                    .animate()
                    .fadeIn(duration: 600.ms)
                    .scale(begin: const Offset(0.8, 0.8), duration: 600.ms),
                const SizedBox(height: 16),
                GradientText(l10n.subscriptionTitle)
                    .animate(delay: 200.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 32),

                // Benefits
                GlassCard(
                  variant: GlassVariant.strong,
                  borderRadius: 20,
                  child: Column(
                    children: benefits.asMap().entries.map((entry) {
                      final (icon, text) = entry.value;
                      return Padding(
                        padding: EdgeInsets.only(
                          bottom: entry.key < benefits.length - 1 ? 12 : 0,
                        ),
                        child: Row(
                          children: [
                            Icon(icon, size: 20, color: AppColors.primary),
                            const SizedBox(width: 12),
                            Expanded(child: Text(text)),
                            const Icon(Icons.check, size: 18, color: AppColors.primary),
                          ],
                        ),
                      );
                    }).toList(),
                  ),
                )
                    .animate(delay: 300.ms)
                    .fadeIn(duration: 600.ms)
                    .slideY(begin: 0.15, duration: 600.ms),
                const SizedBox(height: 24),

                // Plan cards
                ...[
                  _PlanCard(
                    title: l10n.planMonthly,
                    price: l10n.planMonthlyPrice,
                    isSelected: _selectedPlan == 0,
                    onTap: () => setState(() => _selectedPlan = 0),
                  ),
                  _PlanCard(
                    title: l10n.planYearly,
                    price: l10n.planYearlyPrice,
                    isSelected: _selectedPlan == 1,
                    badge: l10n.popular,
                    subtitle: l10n.savePercent,
                    onTap: () => setState(() => _selectedPlan = 1),
                  ),
                  _PlanCard(
                    title: l10n.planLifetime,
                    price: l10n.planLifetimePrice,
                    isSelected: _selectedPlan == 2,
                    onTap: () => setState(() => _selectedPlan = 2),
                  ),
                ].asMap().entries.map((entry) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: entry.value,
                  )
                      .animate(delay: (500 + entry.key * 100).ms)
                      .fadeIn(duration: 500.ms)
                      .slideY(begin: 0.1, duration: 500.ms);
                }),
                const SizedBox(height: 8),

                // CTA button
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    onPressed: () {},
                    child: Text(l10n.tryFree),
                  ),
                )
                    .animate(delay: 800.ms)
                    .fadeIn(duration: 500.ms),
                const SizedBox(height: 12),

                // Disclaimer
                Text(
                  l10n.subscriptionDisclaimer,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.muted,
                  ),
                  textAlign: TextAlign.center,
                )
                    .animate(delay: 900.ms)
                    .fadeIn(duration: 500.ms),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _PlanCard extends StatelessWidget {
  final String title;
  final String price;
  final bool isSelected;
  final String? badge;
  final String? subtitle;
  final VoidCallback onTap;

  const _PlanCard({
    required this.title,
    required this.price,
    required this.isSelected,
    required this.onTap,
    this.badge,
    this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    return GlassCard(
      variant: isSelected ? GlassVariant.strong : GlassVariant.standard,
      borderRadius: 16,
      onTap: onTap,
      child: Container(
        decoration: isSelected
            ? BoxDecoration(
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary, width: 2),
              )
            : null,
        padding: isSelected ? null : const EdgeInsets.all(2),
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                          color: isSelected ? AppColors.primary : AppColors.foreground,
                        ),
                      ),
                      if (badge != null) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            badge!,
                            style: const TextStyle(
                              color: Colors.white,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ],
                    ],
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: TextStyle(fontSize: 12, color: AppColors.primary),
                    ),
                  ],
                ],
              ),
            ),
            Text(
              price,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
                color: isSelected ? AppColors.primary : AppColors.foreground,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
