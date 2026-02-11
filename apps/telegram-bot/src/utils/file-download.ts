import axios from 'axios';

export async function downloadTelegramFile(
  filePath: string,
  botToken: string,
): Promise<Buffer> {
  const url = `https://api.telegram.org/file/bot${botToken}/${filePath}`;
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return Buffer.from(response.data);
}
