import { Bot } from 'grammy';
import { config } from './config';
import { createApiClient } from './api-client/api-client';
import { authMiddleware, BotContext } from './middleware/auth';
import { registerStartHandler } from './handlers/start.handler';
import { registerContactHandler } from './handlers/contact.handler';
import { registerLangHandler } from './handlers/lang.handler';
import { registerHelpHandler } from './handlers/help.handler';
import { registerFridgeHandler } from './handlers/fridge.handler';
import { registerCookHandler } from './handlers/cook.handler';
import { registerConfirmationHandler } from './handlers/confirmation.handler';
import { registerUpdateHandler } from './handlers/update.handler';
import { registerPhotoHandler } from './handlers/photo.handler';
import { registerVoiceHandler } from './handlers/voice.handler';
import { registerTextHandler } from './handlers/text.handler';
import { logger } from './utils/logger';

export const api = createApiClient(config.apiBaseUrl);
export const bot = new Bot<BotContext>(config.telegramBotToken);

// Middleware
bot.use(authMiddleware(api));

// Handlers — registration order matters
registerStartHandler(bot);
registerContactHandler(bot, api);
registerLangHandler(bot, api);
registerHelpHandler(bot);
registerFridgeHandler(bot, api);
registerCookHandler(bot, api);
registerConfirmationHandler(bot, api);
registerUpdateHandler(bot, api);
registerPhotoHandler(bot, api);
registerVoiceHandler(bot, api);
registerTextHandler(bot, api);

// Global error handler
bot.catch((err) => {
  logger.error('Unhandled error:', err.error);
});

// Register bot commands menu
bot.api.setMyCommands([
  { command: 'start', description: 'Start / restart' },
  { command: 'fridge', description: 'Show inventory' },
  { command: 'cook', description: 'What can I cook?' },
  { command: 'lang', description: 'Change language' },
  { command: 'help', description: 'Show help' },
]);
