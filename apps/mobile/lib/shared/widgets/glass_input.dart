import 'dart:ui';
import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class GlassInput extends StatelessWidget {
  final TextEditingController? controller;
  final String? hintText;
  final IconData? prefixIcon;
  final Widget? suffixIcon;
  final bool obscureText;
  final int maxLines;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final TextInputType? keyboardType;
  final String? Function(String?)? validator;

  const GlassInput({
    super.key,
    this.controller,
    this.hintText,
    this.prefixIcon,
    this.suffixIcon,
    this.obscureText = false,
    this.maxLines = 1,
    this.onChanged,
    this.onSubmitted,
    this.keyboardType,
    this.validator,
  });

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(12),
      child: BackdropFilter(
        filter: ImageFilter.blur(
          sigmaX: AppColors.glassInputBlur,
          sigmaY: AppColors.glassInputBlur,
        ),
        child: Container(
          decoration: BoxDecoration(
            color: Colors.white.withValues(alpha: AppColors.glassInputBgOpacity),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: Colors.white.withValues(alpha: AppColors.glassInputBorderOpacity),
            ),
          ),
          child: TextFormField(
            controller: controller,
            obscureText: obscureText,
            maxLines: maxLines,
            onChanged: onChanged,
            onFieldSubmitted: onSubmitted,
            keyboardType: keyboardType,
            validator: validator,
            style: const TextStyle(color: AppColors.foreground),
            decoration: InputDecoration(
              hintText: hintText,
              hintStyle: const TextStyle(color: AppColors.muted),
              prefixIcon: prefixIcon != null
                  ? Icon(prefixIcon, color: AppColors.muted)
                  : null,
              suffixIcon: suffixIcon,
              border: InputBorder.none,
              enabledBorder: InputBorder.none,
              focusedBorder: InputBorder.none,
              errorBorder: InputBorder.none,
              focusedErrorBorder: InputBorder.none,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
          ),
        ),
      ),
    );
  }
}
