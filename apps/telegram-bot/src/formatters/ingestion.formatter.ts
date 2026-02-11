import { ProcessResult } from '../api-client/types';
import { Lang, t, localizeUnit } from '../i18n/locales';

const ACTION_EMOJI: Record<string, string> = {
  ADD: '➕',
  CONSUME: '➖',
  WASTE: '🗑',
  ADJUSTMENT: '🔄',
};

export function formatIngestionResult(result: ProcessResult, lang: Lang): string {
  if (result.cleared_count !== undefined) {
    if (result.cleared_count === 0) {
      return t(lang, 'fridge_already_empty');
    }
    return t(lang, 'fridge_cleared').replace(
      '{count}',
      String(result.cleared_count),
    );
  }

  const lines: string[] = [];

  if (result.processed_items.length === 0 && result.clarifications.length === 0) {
    return t(lang, 'no_items_found');
  }

  if (result.processed_items.length > 0) {
    lines.push(t(lang, 'processed_title'));
    for (const item of result.processed_items) {
      const emoji = ACTION_EMOJI[item.action] || '•';
      const name =
        lang === 'ua'
          ? item.canonical_name_ua || item.canonical_name
          : item.canonical_name;
      const unit = localizeUnit(item.unit, lang);
      lines.push(`${emoji} <b>${name}</b> — ${item.quantity} ${unit}`);
    }
  }

  if (result.clarifications.length > 0) {
    if (lines.length > 0) lines.push('');
    lines.push(t(lang, 'clarification_title'));
    for (const c of result.clarifications) {
      const options = c.candidates
        .map((o) =>
          lang === 'ua'
            ? o.canonical_name_ua || o.canonical_name
            : o.canonical_name,
        )
        .join(', ');
      const unit = localizeUnit(c.unit, lang);
      lines.push(`• <b>${c.raw_name}</b> (${c.quantity} ${unit})`);
      lines.push(`  ${t(lang, 'did_you_mean').replace('{options}', options)}`);
    }
  }

  return lines.join('\n');
}
