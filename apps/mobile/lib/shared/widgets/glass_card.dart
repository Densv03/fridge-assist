import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

enum GlassVariant { standard, strong, subtle, input, button, badge }

class GlassCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final double borderRadius;
  final VoidCallback? onTap;
  final GlassVariant variant;

  const GlassCard({
    super.key,
    required this.child,
    this.padding,
    this.margin,
    this.borderRadius = 16,
    this.onTap,
    this.variant = GlassVariant.standard,
  });

  (double bgOpacity, double blur, double borderOpacity) get _params {
    switch (variant) {
      case GlassVariant.standard:
        return (
          AppColors.glassStandardBgOpacity,
          AppColors.glassStandardBlur,
          AppColors.glassStandardBorderOpacity,
        );
      case GlassVariant.strong:
        return (
          AppColors.glassStrongBgOpacity,
          AppColors.glassStrongBlur,
          AppColors.glassStrongBorderOpacity,
        );
      case GlassVariant.subtle:
        return (
          AppColors.glassSubtleBgOpacity,
          AppColors.glassSubtleBlur,
          AppColors.glassSubtleBorderOpacity,
        );
      case GlassVariant.input:
        return (
          AppColors.glassInputBgOpacity,
          AppColors.glassInputBlur,
          AppColors.glassInputBorderOpacity,
        );
      case GlassVariant.button:
        return (
          AppColors.glassButtonBgOpacity,
          AppColors.glassButtonBlur,
          AppColors.glassButtonBorderOpacity,
        );
      case GlassVariant.badge:
        return (
          AppColors.glassBadgeBgOpacity,
          AppColors.glassBadgeBlur,
          AppColors.glassBadgeBorderOpacity,
        );
    }
  }

  @override
  Widget build(BuildContext context) {
    final (bgOpacity, blur, borderOpacity) = _params;

    return Container(
      margin: margin,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(borderRadius),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: blur, sigmaY: blur),
          child: Material(
            color: Colors.white.withValues(alpha: bgOpacity),
            borderRadius: BorderRadius.circular(borderRadius),
            child: InkWell(
              onTap: onTap,
              borderRadius: BorderRadius.circular(borderRadius),
              child: Container(
                padding: padding ?? const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(borderRadius),
                  border: Border.all(
                    color: Colors.white.withValues(alpha: borderOpacity),
                  ),
                ),
                child: child,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
