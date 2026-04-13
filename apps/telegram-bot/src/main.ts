import { bot } from './bot';
import { logger } from './utils/logger';

// Start long-polling (local development)
bot.start({
  onStart: () => logger.info('Bot started (long-polling)'),
});
