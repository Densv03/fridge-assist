import { Bot } from 'grammy';
import { BotContext } from '../middleware/auth';
import { ApiClient } from '../api-client/api-client';
import { getAllUsers } from '../api-client/users.api';
import { config } from '../config';
import { t } from '../i18n/locales';
import { logger } from '../utils/logger';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function registerUpdateHandler(bot: Bot<BotContext>, api: ApiClient): void {
  bot.command('update', async (ctx) => {
    if (ctx.from?.id?.toString() !== config.adminChatId) {
      return;
    }

    const description = ctx.match?.toString().trim();
    if (!description) {
      await ctx.reply(t(ctx.lang, 'update_no_text'), { parse_mode: 'HTML' });
      return;
    }

    try {
      const users = await getAllUsers(api);
      const recipients = users.filter(
        (u) =>
          u.provider === 'telegram' &&
          u.phone
      );

      await ctx.reply(
        t(ctx.lang, 'update_started').replace('{count}', String(recipients.length)),
        { parse_mode: 'HTML', disable_notification: true },

      );

      const message = `📢 <b>Update</b>\n\n${description}`;
      let success = 0;
      let failed = 0;

      for (const user of recipients) {
        try {
          await bot.api.sendMessage(user.provider_user_id, message, {
            parse_mode: 'HTML',
            disable_notification: true,
          });
          success++;
        } catch (err) {
          failed++;
          logger.error(`Failed to send update to ${user.provider_user_id}`, err);
        }
        await delay(50);
      }

      await ctx.reply(
        t(ctx.lang, 'update_finished')
          .replace('{success}', String(success))
          .replace('{failed}', String(failed)),
        { parse_mode: 'HTML' },
      );
    } catch (err) {
      logger.error('Failed to broadcast update', err);
      await ctx.reply('Failed to broadcast update.');
    }
  });
}
