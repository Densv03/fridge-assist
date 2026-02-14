import { Context } from 'grammy';

const SIZE = 5;
const FRAMES = Array.from({ length: SIZE + 1 }, (_, i) =>
  '▓'.repeat(i) + '░'.repeat(SIZE - i),
);
const INTERVAL_MS = 700;

export async function showLoading(
  ctx: Context,
): Promise<() => Promise<void>> {
  const msg = await ctx.reply(FRAMES[0]);
  let frame = 1;
  let stopped = false;

  const interval = setInterval(async () => {
    if (stopped) return;
    try {
      await ctx.api.editMessageText(
        msg.chat.id,
        msg.message_id,
        FRAMES[frame % FRAMES.length],
      );
      frame++;
    } catch {
      // message may already be deleted
    }
  }, INTERVAL_MS);

  return async () => {
    if (stopped) return;
    stopped = true;
    clearInterval(interval);
    try {
      await ctx.api.deleteMessage(msg.chat.id, msg.message_id);
    } catch {
      // message may already be gone
    }
  };
}
