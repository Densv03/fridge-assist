export const config = {
  telegramBotToken: requireEnv('TELEGRAM_BOT_TOKEN'),
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000/api',
  adminChatId: process.env.ADMIN_CHAT_ID || '',
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
