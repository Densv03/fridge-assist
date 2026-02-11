import { Bot, Keyboard } from 'grammy';
import { BotContext } from '../middleware/auth';
import { t } from '../i18n/locales';

export function registerStartHandler(bot: Bot<BotContext>): void {
  bot.command('start', async (ctx) => {
    const keyboard = new Keyboard()
      .requestContact(t(ctx.lang, 'share_phone_button'))
      .resized()
      .oneTime();

    await ctx.reply(t(ctx.lang, 'welcome'), {
      parse_mode: 'HTML',
      reply_markup: keyboard,
    });
  });
}
