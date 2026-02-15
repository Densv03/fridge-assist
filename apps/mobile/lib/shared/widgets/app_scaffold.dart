import 'package:flutter/material.dart';
import 'gradient_background.dart';
import 'bottom_nav.dart';

class AppScaffold extends StatelessWidget {
  final Widget child;

  const AppScaffold({super.key, required this.child});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientBackground(
        child: Stack(
          children: [
            child,
            const Positioned(
              left: 0,
              right: 0,
              bottom: 0,
              child: BottomNav(),
            ),
          ],
        ),
      ),
    );
  }
}
