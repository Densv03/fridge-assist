import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import 'floating_bubble.dart';

class GradientBackground extends StatelessWidget {
  final Widget child;
  final bool showBubbles;

  const GradientBackground({
    super.key,
    required this.child,
    this.showBubbles = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment(-0.5, -0.8),
          end: Alignment(0.5, 0.8),
          colors: [
            AppColors.gradientStop1,
            AppColors.gradientStop2,
            AppColors.gradientStop3,
            AppColors.gradientStop4,
          ],
          stops: [0.0, 0.35, 0.65, 1.0],
        ),
      ),
      child: showBubbles
          ? Stack(
              children: [
                const Positioned(
                  top: 80,
                  left: 30,
                  child: FloatingBubble(size: 60, opacity: 0.15),
                ),
                const Positioned(
                  top: 200,
                  right: 40,
                  child: FloatingBubble(size: 40, opacity: 0.10),
                ),
                const Positioned(
                  bottom: 180,
                  left: 60,
                  child: FloatingBubble(size: 50, opacity: 0.12),
                ),
                const Positioned(
                  bottom: 100,
                  right: 20,
                  child: FloatingBubble(size: 35, opacity: 0.08),
                ),
                const Positioned(
                  top: 350,
                  left: 10,
                  child: FloatingBubble(size: 25, opacity: 0.10),
                ),
                child,
              ],
            )
          : child,
    );
  }
}
