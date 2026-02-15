import 'dart:ui';
import 'package:flutter/material.dart';

class FloatingBubble extends StatefulWidget {
  final double size;
  final double opacity;

  const FloatingBubble({
    super.key,
    this.size = 40,
    this.opacity = 0.12,
  });

  @override
  State<FloatingBubble> createState() => _FloatingBubbleState();
}

class _FloatingBubbleState extends State<FloatingBubble>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 6),
      vsync: this,
    );
    _animation = Tween<double>(begin: 0, end: -10).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
    _controller.repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animation,
      builder: (context, child) {
        return Transform.translate(
          offset: Offset(0, _animation.value),
          child: child,
        );
      },
      child: ClipOval(
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
          child: Container(
            width: widget.size,
            height: widget.size,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: Colors.white.withValues(alpha: widget.opacity),
              border: Border.all(
                color: Colors.white.withValues(alpha: widget.opacity * 0.5),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
