import FormData from 'form-data';
import { ApiClient } from './api-client';
import { ProcessResult } from './types';

export async function ingestText(
  api: ApiClient,
  userId: string,
  text: string,
): Promise<ProcessResult> {
  const { data } = await api.post<ProcessResult>(
    '/ingestion/text',
    { text },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function ingestImage(
  api: ApiClient,
  userId: string,
  buffer: Buffer,
  filename: string,
  mime: string,
): Promise<ProcessResult> {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: mime });

  const { data } = await api.post<ProcessResult>('/ingestion/image', form, {
    headers: {
      'x-user-id': userId,
      ...form.getHeaders(),
    },
  });
  return data;
}

export async function ingestAudio(
  api: ApiClient,
  userId: string,
  buffer: Buffer,
  filename: string,
  mime: string,
): Promise<ProcessResult> {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: mime });

  const { data } = await api.post<ProcessResult>('/ingestion/audio', form, {
    headers: {
      'x-user-id': userId,
      ...form.getHeaders(),
    },
  });
  return data;
}
