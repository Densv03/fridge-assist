import { Bot } from 'grammy';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';

export function registerHelpHandler(bot: Bot<BotContext>): void {
  bot.command('help', async (ctx) => {
    await ctx.reply(t(ctx.lang, 'help_title') + '\n' + t(ctx.lang, 'help_commands'), {
      parse_mode: 'HTML',
    });
  });
}
