import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';

class GradientText extends StatelessWidget {
  final String text;
  final TextStyle? style;

  const GradientText(
    this.text, {
    super.key,
    this.style,
  });

  @override
  Widget build(BuildContext context) {
    final effectiveStyle = style ??
        Theme.of(context).textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.bold,
            );

    return ShaderMask(
      blendMode: BlendMode.srcIn,
      shaderCallback: (bounds) => const LinearGradient(
        colors: [AppColors.gradientTextStart, AppColors.gradientTextEnd],
      ).createShader(Rect.fromLTWH(0, 0, bounds.width, bounds.height)),
      child: Text(text, style: effectiveStyle),
    );
  }
}
