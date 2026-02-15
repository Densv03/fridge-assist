import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:mobile/core/l10n/generated/app_localizations.dart';
import 'package:image_picker/image_picker.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../../shared/widgets/glass_input.dart';
import '../../../../data/providers.dart';
import '../../../../data/models/extraction_preview.dart';
import '../../../settings/presentation/providers/locale_provider.dart';

class AddItemsScreen extends ConsumerStatefulWidget {
  const AddItemsScreen({super.key});

  @override
  ConsumerState<AddItemsScreen> createState() => _AddItemsScreenState();
}

class _AddItemsScreenState extends ConsumerState<AddItemsScreen> {
  int _selectedTab = 0;
  final _textController = TextEditingController();
  bool _isLoading = false;
  ExtractionPreview? _preview;

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

  Future<void> _submitText() async {
    final text = _textController.text.trim();
    if (text.isEmpty) return;

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final preview = await repo.previewText(text);
      setState(() => _preview = preview);
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

  Future<void> _submitImage(ImageSource source) async {
    final picker = ImagePicker();
    final picked = await picker.pickImage(source: source, imageQuality: 85);
    if (picked == null) return;

    setState(() => _isLoading = true);
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final preview = await repo.previewImage(File(picked.path));
      setState(() => _preview = preview);
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

  Future<void> _confirm() async {
    if (_preview == null) return;
    setState(() => _isLoading = true);
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      await repo.confirm(_preview!.previewId);
      setState(() {
        _preview = null;
        _textController.clear();
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(AppLocalizations.of(context)!.confirmed),
          ),
        );
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

  Future<void> _cancel() async {
    if (_preview == null) return;
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      await repo.cancel(_preview!.previewId);
    } catch (_) {}
    setState(() => _preview = null);
  }

  Future<void> _removeItem(String itemId) async {
    if (_preview == null) return;
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final updated = await repo.removeItem(_preview!.previewId, itemId);
      setState(() => _preview = updated);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _resolveClarification(
      String clarificationId, String ingredientId) async {
    if (_preview == null) return;
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final updated = await repo.resolveItem(
          _preview!.previewId, clarificationId, ingredientId);
      setState(() => _preview = updated);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Future<void> _resolveConflict(String itemId, String resolution) async {
    if (_preview == null) return;
    try {
      final repo = ref.read(ingestionRepositoryProvider);
      final updated =
          await repo.resolveConflict(_preview!.previewId, itemId, resolution);
      setState(() => _preview = updated);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(e.toString())),
        );
      }
    }
  }

  Widget _buildConfidenceDot(double confidence) {
    Color color;
    if (confidence >= 0.9) {
      color = AppColors.success;
    } else if (confidence >= 0.7) {
      color = AppColors.warning;
    } else {
      color = Colors.orange;
    }
    return Container(
      width: 8,
      height: 8,
      decoration: BoxDecoration(color: color, shape: BoxShape.circle),
    );
  }

  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context)!;
    final isUa = ref.watch(localeProvider).languageCode == 'uk';

    if (_preview != null) {
      return _buildPreviewScreen(l10n, isUa);
    }

    final tabs = [
      (Icons.camera_alt, l10n.photo),
      (Icons.mic, l10n.voice),
      (Icons.edit, l10n.text),
    ];

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
        child: Column(
          children: [
            // Custom glass tab bar
            GlassCard(
              variant: GlassVariant.strong,
              borderRadius: 16,
              padding: const EdgeInsets.all(4),
              child: Row(
                children: List.generate(tabs.length, (index) {
                  final (icon, label) = tabs[index];
                  final isActive = _selectedTab == index;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedTab = index),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: BoxDecoration(
                          color: isActive
                              ? AppColors.primary
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Icon(icon,
                                size: 18,
                                color: isActive
                                    ? Colors.white
                                    : AppColors.muted),
                            const SizedBox(width: 6),
                            Text(
                              label,
                              style: TextStyle(
                                fontSize: 13,
                                fontWeight: isActive
                                    ? FontWeight.w600
                                    : FontWeight.w400,
                                color: isActive
                                    ? Colors.white
                                    : AppColors.muted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                }),
              ),
            )
                .animate()
                .fadeIn(duration: 400.ms),
            const SizedBox(height: 24),

            Expanded(
              child: _isLoading
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          CircularProgressIndicator(color: AppColors.primary),
                          const SizedBox(height: 16),
                          Text(l10n.analyzing),
                        ],
                      ),
                    )
                  : IndexedStack(
                      index: _selectedTab,
                      children: [
                        // Photo tab
                        Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            GlassCard(
                              variant: GlassVariant.strong,
                              onTap: () => _submitImage(ImageSource.camera),
                              padding: const EdgeInsets.all(32),
                              child: Column(
                                children: [
                                  const Text('📷',
                                      style: TextStyle(fontSize: 48)),
                                  const SizedBox(height: 12),
                                  Text(l10n.takePhoto),
                                ],
                              ),
                            )
                                .animate(delay: 100.ms)
                                .fadeIn(duration: 500.ms)
                                .slideY(begin: 0.2, duration: 500.ms),
                            const SizedBox(height: 16),
                            GlassCard(
                              variant: GlassVariant.strong,
                              onTap: () => _submitImage(ImageSource.gallery),
                              padding: const EdgeInsets.all(32),
                              child: Column(
                                children: [
                                  const Text('🖼️',
                                      style: TextStyle(fontSize: 48)),
                                  const SizedBox(height: 12),
                                  Text(l10n.chooseFromGallery),
                                ],
                              ),
                            )
                                .animate(delay: 200.ms)
                                .fadeIn(duration: 500.ms)
                                .slideY(begin: 0.2, duration: 500.ms),
                          ],
                        ),

                        // Voice tab
                        Center(
                          child: GlassCard(
                            variant: GlassVariant.strong,
                            padding: const EdgeInsets.all(40),
                            child: Column(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Text('🎙️',
                                    style: TextStyle(fontSize: 64)),
                                const SizedBox(height: 16),
                                Text(l10n.startRecording),
                              ],
                            ),
                          ),
                        ),

                        // Text tab
                        Column(
                          children: [
                            const SizedBox(height: 16),
                            GlassCard(
                              variant: GlassVariant.strong,
                              child: Column(
                                children: [
                                  GlassInput(
                                    controller: _textController,
                                    maxLines: 5,
                                    hintText: l10n.textInputHint,
                                  ),
                                  const SizedBox(height: 16),
                                  SizedBox(
                                    width: double.infinity,
                                    child: ElevatedButton(
                                      onPressed: _submitText,
                                      child: Text(l10n.confirm),
                                    ),
                                  ),
                                ],
                              ),
                            )
                                .animate(delay: 100.ms)
                                .fadeIn(duration: 500.ms)
                                .slideY(begin: 0.2, duration: 500.ms),
                          ],
                        ),
                      ],
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPreviewScreen(AppLocalizations l10n, bool isUa) {
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 16, 16, 96),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                GlassCard(
                  variant: GlassVariant.subtle,
                  borderRadius: 12,
                  padding: const EdgeInsets.all(8),
                  onTap: _cancel,
                  child: const Icon(Icons.arrow_back, size: 20),
                ),
                const SizedBox(width: 12),
                Text(
                  l10n.itemsDetected,
                  style: Theme.of(context)
                      .textTheme
                      .titleLarge
                      ?.copyWith(fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                _buildConfidenceDot(1.0),
                const SizedBox(width: 4),
                Text(l10n.exactMatch, style: const TextStyle(fontSize: 11)),
                const SizedBox(width: 12),
                _buildConfidenceDot(0.8),
                const SizedBox(width: 4),
                Text(l10n.likelyMatch, style: const TextStyle(fontSize: 11)),
                const SizedBox(width: 12),
                _buildConfidenceDot(0.5),
                const SizedBox(width: 4),
                Text(l10n.approxMatch, style: const TextStyle(fontSize: 11)),
              ],
            ),
            const SizedBox(height: 16),

            ...(_preview?.items ?? []).asMap().entries.map((entry) {
              final item = entry.value;
              final name = isUa
                  ? (item.canonicalNameUa ?? item.canonicalName)
                  : item.canonicalName;
              return GlassCard(
                margin: const EdgeInsets.only(bottom: 8),
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        _buildConfidenceDot(item.confidence),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(name,
                              style: const TextStyle(
                                  fontWeight: FontWeight.w600)),
                        ),
                        Text('${item.quantity} ${item.unit}',
                            style: TextStyle(color: AppColors.muted)),
                        const SizedBox(width: 8),
                        InkWell(
                          onTap: () => _removeItem(item.id),
                          child: const Icon(Icons.close,
                              size: 18, color: AppColors.error),
                        ),
                      ],
                    ),
                    if (item.unitConflict != null &&
                        item.unitConflict!.resolution == null) ...[
                      const SizedBox(height: 8),
                      Text(
                        l10n.currentlyInFridge(
                          item.unitConflict!.existingQuantity.toString(),
                          item.unitConflict!.existingUnit,
                        ),
                        style:
                            TextStyle(fontSize: 12, color: AppColors.muted),
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Expanded(
                            child: GlassCard(
                              variant: GlassVariant.button,
                              borderRadius: 8,
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              onTap: () =>
                                  _resolveConflict(item.id, 'combine'),
                              child: Center(
                                child: Text(
                                  l10n.combineUnit(
                                    item.unitConflict!.aiEstimateCombined
                                        .toString(),
                                    item.unitConflict!.existingUnit,
                                  ),
                                  style: const TextStyle(fontSize: 12),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: GlassCard(
                              variant: GlassVariant.button,
                              borderRadius: 8,
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              onTap: () =>
                                  _resolveConflict(item.id, 'separate'),
                              child: Center(
                                child: Text(l10n.separateUnit,
                                    style: const TextStyle(fontSize: 12)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              )
                  .animate(delay: (100 + entry.key * 60).ms)
                  .fadeIn(duration: 400.ms)
                  .slideY(begin: 0.1, duration: 400.ms);
            }),

            if ((_preview?.clarifications ?? []).isNotEmpty) ...[
              const SizedBox(height: 16),
              Text(
                l10n.needsClarification,
                style: Theme.of(context)
                    .textTheme
                    .titleMedium
                    ?.copyWith(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              ...(_preview?.clarifications ?? []).map((clar) {
                return GlassCard(
                  margin: const EdgeInsets.only(bottom: 8),
                  padding: const EdgeInsets.all(12),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${clar.rawName} (${clar.quantity} ${clar.unit})',
                        style:
                            const TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const SizedBox(height: 8),
                      Wrap(
                        spacing: 8,
                        runSpacing: 4,
                        children: clar.candidates.map((c) {
                          final cName = isUa
                              ? (c.canonicalNameUa ?? c.canonicalName)
                              : c.canonicalName;
                          return GlassCard(
                            variant: GlassVariant.button,
                            borderRadius: 20,
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 6),
                            onTap: () =>
                                _resolveClarification(clar.id, c.id),
                            child: Text(cName,
                                style: const TextStyle(fontSize: 13)),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                );
              }),
            ],

            const SizedBox(height: 24),

            Row(
              children: [
                Expanded(
                  child: GlassCard(
                    variant: GlassVariant.button,
                    borderRadius: 12,
                    padding: EdgeInsets.zero,
                    onTap: _isLoading ? null : _cancel,
                    child: SizedBox(
                      height: 52,
                      child: Center(
                        child: Text(l10n.cancel,
                            style: const TextStyle(
                                fontWeight: FontWeight.w600,
                                color: AppColors.foreground)),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: _isLoading ? null : _confirm,
                    child: _isLoading
                        ? const SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(
                                strokeWidth: 2, color: Colors.white),
                          )
                        : Text(l10n.confirm),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
