import { ApiClient } from '../api-client/api-client';
import { createReport } from '../api-client/reports.api';
import { ExtractionPreview } from '../api-client/types';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';
import { logger } from './logger';
import { config } from '../config';

export async function handleReportIntent(
  ctx: BotContext & { lang: 'ua' | 'en'; internalUserId?: string },
  api: ApiClient,
  preview: ExtractionPreview,
): Promise<void> {
  const reportType = preview.report_type || 'bug';
  const description = preview.report_description || '';

  try {
    await createReport(api, ctx.internalUserId!, reportType, description);

    const typeLabel = t(ctx.lang, reportType === 'bug' ? 'report_type_bug' : 'report_type_idea');
    const message = t(ctx.lang, 'report_saved').replace('{type}', typeLabel);
    await ctx.reply(message, { parse_mode: 'HTML' });

    // Notify admin
    if (config.adminChatId) {
      const userName = ctx.from?.first_name || 'Unknown';
      const userTag = ctx.from?.username ? `@${ctx.from.username}` : '';
      const adminText =
        `📋 <b>New ${reportType}</b>\n` +
        `👤 ${userName} ${userTag}\n` +
        `💬 ${description}`;
      try {
        await ctx.api.sendMessage(config.adminChatId, adminText, {
          parse_mode: 'HTML',
        });
      } catch (adminErr) {
        logger.error('Failed to notify admin', adminErr);
      }
    }
  } catch (err) {
    logger.error('Failed to save report', err);
    await ctx.reply(t(ctx.lang, 'report_error'));
  }
}
