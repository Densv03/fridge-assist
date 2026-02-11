const PREFIX = '[telegram-bot]';

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info: (...args: unknown[]) =>
    console.log(timestamp(), PREFIX, ...args),
  warn: (...args: unknown[]) =>
    console.warn(timestamp(), PREFIX, 'WARN', ...args),
  error: (...args: unknown[]) =>
    console.error(timestamp(), PREFIX, 'ERROR', ...args),
};
