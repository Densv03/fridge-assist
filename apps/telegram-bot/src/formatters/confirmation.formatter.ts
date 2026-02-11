import { InlineKeyboard } from 'grammy';
import { ExtractionPreview } from '../api-client/types';
import { Lang, t, localizeUnit } from '../i18n/locales';

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
    const unit = localizeUnit(item.unit, lang);
    const badge = confidenceBadge(item.confidence);
    if (item.confidence < 1.0) hasLowConfidence = true;
    lines.push(`${badge} <b>${name}</b> — ${item.quantity} ${unit}`);
  }

  if (preview.clarifications.length > 0) {
    if (preview.items.length > 0) lines.push('');
    lines.push(`❓ ${t(lang, 'preview_clarification_note')}`);
    for (const c of preview.clarifications) {
      const unit = localizeUnit(c.unit, lang);
      lines.push(`• <b>${c.raw_name}</b> — ${c.quantity} ${unit}`);
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

  // Per matched item: remove + replace buttons
  for (const item of preview.items) {
    const itemShort = itemShortMap.get(item.id) ?? item.id.slice(0, 8);
    const name =
      lang === 'ua'
        ? item.canonical_name_ua || item.canonical_name
        : item.canonical_name;
    kb.text(`❌ ${name}`, `rm:${shortId}:${itemShort}`)
      .text('✏️', `rpl:${shortId}:${itemShort}`)
      .text('🔢', `qty:${shortId}:${itemShort}`)
      .row();
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

  // Bottom row: confirm + cancel
  kb.text(t(lang, 'btn_confirm'), `cfm:${shortId}`)
    .text(t(lang, 'btn_cancel'), `cxl:${shortId}`);

  return kb;
}
