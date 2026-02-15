import 'package:flutter/material.dart';

class AppColors {
  // Primary (teal matching web's hsl(152, 55%, 45%))
  static const Color primary = Color(0xFF33A06A);
  static const Color primaryLight = Color(0xFF5DC183);
  static const Color primaryDark = Color(0xFF278A56);

  // Background gradient stops (145deg)
  static const Color gradientStop1 = Color(0xFFD1EDE0);
  static const Color gradientStop2 = Color(0xFFCDE5E8);
  static const Color gradientStop3 = Color(0xFFDFE3EC);
  static const Color gradientStop4 = Color(0xFFD3E4E0);

  // Gradient text
  static const Color gradientTextStart = Color(0xFF278A56);
  static const Color gradientTextEnd = Color(0xFF299BAD);

  // Text
  static const Color foreground = Color(0xFF1B2B3A);
  static const Color muted = Color(0xFF616F80);

  // Glass variants — background opacity, blur sigma, border opacity
  // standard
  static const double glassStandardBgOpacity = 0.20;
  static const double glassStandardBlur = 20;
  static const double glassStandardBorderOpacity = 0.40;

  // strong
  static const double glassStrongBgOpacity = 0.35;
  static const double glassStrongBlur = 24;
  static const double glassStrongBorderOpacity = 0.50;

  // subtle
  static const double glassSubtleBgOpacity = 0.12;
  static const double glassSubtleBlur = 12;
  static const double glassSubtleBorderOpacity = 0.20;

  // input
  static const double glassInputBgOpacity = 0.25;
  static const double glassInputBlur = 12;
  static const double glassInputBorderOpacity = 0.40;

  // button
  static const double glassButtonBgOpacity = 0.30;
  static const double glassButtonBlur = 16;
  static const double glassButtonBorderOpacity = 0.50;

  // badge
  static const double glassBadgeBgOpacity = 0.25;
  static const double glassBadgeBlur = 8;
  static const double glassBadgeBorderOpacity = 0.30;

  // Status
  static const Color success = primary;
  static const Color warning = Color(0xFFF59E0B);
  static const Color error = Color(0xFFE04557);
  static const Color info = Color(0xFF3B82F6);

  // Bubble
  static const Color bubble = Color(0xFFFFFFFF);
}
