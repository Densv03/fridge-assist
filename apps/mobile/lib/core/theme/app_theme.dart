import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class AppTheme {
  static ThemeData get light {
    final plusJakarta = GoogleFonts.plusJakartaSansTextTheme();
    final inter = GoogleFonts.interTextTheme();

    final textTheme = TextTheme(
      displayLarge: plusJakarta.displayLarge?.copyWith(color: AppColors.foreground),
      displayMedium: plusJakarta.displayMedium?.copyWith(color: AppColors.foreground),
      displaySmall: plusJakarta.displaySmall?.copyWith(color: AppColors.foreground),
      headlineLarge: plusJakarta.headlineLarge?.copyWith(color: AppColors.foreground),
      headlineMedium: plusJakarta.headlineMedium?.copyWith(color: AppColors.foreground),
      headlineSmall: plusJakarta.headlineSmall?.copyWith(color: AppColors.foreground),
      titleLarge: plusJakarta.titleLarge?.copyWith(color: AppColors.foreground),
      titleMedium: plusJakarta.titleMedium?.copyWith(color: AppColors.foreground),
      titleSmall: plusJakarta.titleSmall?.copyWith(color: AppColors.foreground),
      bodyLarge: inter.bodyLarge?.copyWith(color: AppColors.foreground),
      bodyMedium: inter.bodyMedium?.copyWith(color: AppColors.foreground),
      bodySmall: inter.bodySmall?.copyWith(color: AppColors.muted),
      labelLarge: inter.labelLarge?.copyWith(color: AppColors.foreground),
      labelMedium: inter.labelMedium?.copyWith(color: AppColors.muted),
      labelSmall: inter.labelSmall?.copyWith(color: AppColors.muted),
    );

    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorSchemeSeed: AppColors.primary,
      scaffoldBackgroundColor: Colors.transparent,
      textTheme: textTheme,
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        titleTextStyle: plusJakarta.titleLarge?.copyWith(
          color: AppColors.foreground,
          fontWeight: FontWeight.w600,
        ),
        iconTheme: const IconThemeData(color: AppColors.foreground),
      ),
      cardTheme: CardThemeData(
        color: Colors.white.withValues(alpha: 0.2),
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white.withValues(alpha: AppColors.glassInputBgOpacity),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.white.withValues(alpha: AppColors.glassInputBorderOpacity),
          ),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(
            color: Colors.white.withValues(alpha: AppColors.glassInputBorderOpacity),
          ),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 4,
          shadowColor: AppColors.primary.withValues(alpha: 0.3),
          textStyle: inter.labelLarge?.copyWith(
            fontSize: 16,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          minimumSize: const Size(double.infinity, 52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          side: const BorderSide(color: AppColors.primary),
        ),
      ),
    );
  }
}
