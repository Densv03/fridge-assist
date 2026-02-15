import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/glass_input.dart';
import '../../../../data/providers.dart';

class ConsumeScreen extends ConsumerStatefulWidget {
  const ConsumeScreen({super.key});

  @override
  ConsumerState<ConsumeScreen> createState() => _ConsumeScreenState();
}

class _ConsumeScreenState extends ConsumerState<ConsumeScreen> {
  final _textController = TextEditingController();
  bool _isLoading = false;

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final preview = await repo.previewText(text);

      if (!mounted) return;

      final confirmed = await showDialog<bool>(
        context: context,
        builder: (ctx) => AlertDialog(
          title: Text(AppLocalizations.of(context)!.confirm),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: preview.items
                .map((item) => Text('${item.canonicalName} - ${item.quantity} ${item.unit}'))
                .toList(),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: Text(AppLocalizations.of(context)!.cancel),
            ),
            ElevatedButton(
              onPressed: () => Navigator.pop(ctx, true),
              child: Text(AppLocalizations.of(context)!.confirm),
            ),
          ],
        ),
      );

      if (confirmed == true) {
        await repo.confirm(preview.previewId);
        if (mounted) {
          _textController.clear();
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(AppLocalizations.of(context)!.confirmed)),
          );
        }
      } else {
        await repo.cancel(preview.previewId);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 24, 16, 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              l10n.consumeTitle,
              style: Theme.of(context)
                  .textTheme
                  .headlineSmall
                  ?.copyWith(fontWeight: FontWeight.bold),
            )
                .animate()
                .fadeIn(duration: 500.ms)
                .slideY(begin: -0.1, duration: 500.ms),
            const SizedBox(height: 24),
            GlassCard(
              variant: GlassVariant.strong,
              child: Column(
                children: [
                  GlassInput(
                    controller: _textController,
                    maxLines: 3,
                    hintText: l10n.consumeHint,
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          onPressed: _isLoading ? null : _submit,
                          icon: _isLoading
                              ? const SizedBox(
                                  height: 18,
                                  width: 18,
                                  child: CircularProgressIndicator(
                                      strokeWidth: 2, color: Colors.white),
                                )
                              : const Icon(Icons.send, size: 18),
                          label: Text(l10n.confirm),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            )
                .animate(delay: 200.ms)
                .fadeIn(duration: 600.ms)
                .slideY(begin: 0.2, duration: 600.ms),
          ],
        ),
      ),
    );
  }
}
