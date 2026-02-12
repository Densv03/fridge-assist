import { InlineKeyboard } from 'grammy';
import { ExtractionPreview } from '../api-client/types';
import { Lang, t, localizeUnit } from '../i18n/locales';
import { formatForDisplay } from '../utils/unit-display';

const ACTION_EMOJI: Record<string, string> = {
  ADD: '➕',
  CONSUME: '➖',
  WASTE: '🗑',
  ADJUSTMENT: '🔄',
};

function confidenceBadge(confidence: number): string {
  if (confidence >= 0.8) return '🟢';
  if (confidence >= 0.5) return '🟡';
  return '🟠';
}

export function formatPreview(preview: ExtractionPreview, lang: Lang): string {
  const lines: string[] = [];
  const emoji = ACTION_EMOJI[preview.intent] || '📋';

  lines.push(`${emoji} ${t(lang, 'preview_title')}`);
  lines.push('');

  let hasLowConfidence = false;

  for (const item of preview.items) {
    const name =
      lang === 'ua'
        ? item.canonical_name_ua || item.canonical_name
        : item.canonical_name;
    const display = formatForDisplay(item.quantity, item.unit);
    const unit = localizeUnit(display.unit, lang);
    const conflict = item.unit_conflict;

    if (conflict && !conflict.resolution) {
      // Unresolved conflict — show warning badge
      const existingUnit = localizeUnit(conflict.existing_unit, lang);
      const conflictLabel = t(lang, 'unit_conflict_label')
        .replace('{qty}', String(conflict.existing_quantity))
        .replace('{unit}', existingUnit);
      lines.push(`⚠️ <b>${name}</b> — ${display.quantity} ${unit}`);
      lines.push(`   ${conflictLabel}`);
    } else if (conflict?.resolution === 'combine') {
      const existingUnit = localizeUnit(conflict.existing_unit, lang);
      const note = t(lang, 'unit_conflict_combined_note')
        .replace('{qty}', String(conflict.existing_quantity))
        .replace('{unit}', existingUnit);
      const badge = confidenceBadge(item.confidence);
      if (item.confidence < 1.0) hasLowConfidence = true;
      lines.push(`${badge} <b>${name}</b> — ${display.quantity} ${unit} ${note}`);
    } else if (conflict?.resolution === 'separate') {
      const note = t(lang, 'unit_conflict_separated_note');
      const badge = confidenceBadge(item.confidence);
      if (item.confidence < 1.0) hasLowConfidence = true;
      lines.push(`${badge} <b>${name}</b> — ${display.quantity} ${unit} ${note}`);
    } else {
      const badge = confidenceBadge(item.confidence);
      if (item.confidence < 1.0) hasLowConfidence = true;
      lines.push(`${badge} <b>${name}</b> — ${display.quantity} ${unit}`);
    }
  }

  if (preview.clarifications.length > 0) {
    if (preview.items.length > 0) lines.push('');
    lines.push(`❓ ${t(lang, 'preview_clarification_note')}`);
    for (const c of preview.clarifications) {
      const display = formatForDisplay(c.quantity, c.unit);
      const unit = localizeUnit(display.unit, lang);
      lines.push(`• <b>${c.raw_name}</b> — ${display.quantity} ${unit}`);
    }
  }

  if (hasLowConfidence) {
    lines.push('');
    lines.push(t(lang, 'preview_confidence_legend'));
  }

  return lines.join('\n');
}

export function buildPreviewKeyboard(
  preview: ExtractionPreview,
  shortId: string,
  itemIdMap: Map<string, string>,
  candidateIdMap: Map<string, string>,
  lang: Lang,
): InlineKeyboard {
  const kb = new InlineKeyboard();

  // Reverse maps: full UUID → short ID
  const itemShortMap = new Map<string, string>();
  for (const [short, full] of itemIdMap) {
    itemShortMap.set(full, short);
  }
  const candidateShortMap = new Map<string, string>();
  for (const [short, full] of candidateIdMap) {
    candidateShortMap.set(full, short);
  }

  // Check if any item has an unresolved unit conflict
  const hasUnresolvedConflict = preview.items.some(
    (item) => item.unit_conflict && !item.unit_conflict.resolution,
  );

  // Per matched item: show conflict buttons or normal buttons
  for (const item of preview.items) {
    const itemShort = itemShortMap.get(item.id) ?? item.id.slice(0, 8);
    const conflict = item.unit_conflict;

    if (conflict && !conflict.resolution) {
      // Unresolved conflict — show combine/separate buttons
      const existingUnit = localizeUnit(conflict.existing_unit, lang);
      const combineLabel = t(lang, 'unit_conflict_combine_btn')
        .replace('{combined}', String(Math.round(conflict.ai_estimate_combined * 100) / 100))
        .replace('{unit}', existingUnit);
      const separateLabel = t(lang, 'unit_conflict_separate_btn');

      kb.text(combineLabel, `ucmb:${shortId}:${itemShort}`).row();
      kb.text(separateLabel, `usep:${shortId}:${itemShort}`).row();
    } else {
      // Normal buttons: remove + replace + change amount
      const name =
        lang === 'ua'
          ? item.canonical_name_ua || item.canonical_name
          : item.canonical_name;
      kb.text(`❌ ${name}`, `rm:${shortId}:${itemShort}`)
        .text('✏️', `rpl:${shortId}:${itemShort}`)
        .text('🔢', `qty:${shortId}:${itemShort}`)
        .row();
    }
  }

  // Per ambiguous item: candidate buttons + custom
  for (const c of preview.clarifications) {
    const itemShort = itemShortMap.get(c.id) ?? c.id.slice(0, 8);
    for (const cand of c.candidates) {
      const candShort =
        candidateShortMap.get(cand.id) ?? cand.id.slice(0, 8);
      const name =
        lang === 'ua'
          ? cand.canonical_name_ua || cand.canonical_name
          : cand.canonical_name;
      kb.text(name, `res:${shortId}:${itemShort}:${candShort}`);
    }
    kb.text(t(lang, 'btn_custom'), `cst:${shortId}:${itemShort}`);
    kb.row();
  }

  // Bottom row: confirm (hidden if unresolved conflicts) + cancel
  if (!hasUnresolvedConflict) {
    kb.text(t(lang, 'btn_confirm'), `cfm:${shortId}`);
  }
  kb.text(t(lang, 'btn_cancel'), `cxl:${shortId}`);

  return kb;
}
