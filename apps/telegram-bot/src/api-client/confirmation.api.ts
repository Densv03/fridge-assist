import FormData from 'form-data';
import { ApiClient } from './api-client';
import { ExtractionPreview, ProcessResult } from './types';

export async function previewText(
  api: ApiClient,
  userId: string,
  text: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/text',
    { text },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function previewImage(
  api: ApiClient,
  userId: string,
  buffer: Buffer,
  filename: string,
  mime: string,
): Promise<ExtractionPreview> {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: mime });

  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/image',
    form,
    {
      headers: {
        'x-user-id': userId,
        ...form.getHeaders(),
      },
    },
  );
  return data;
}

export async function previewAudio(
  api: ApiClient,
  userId: string,
  buffer: Buffer,
  filename: string,
  mime: string,
): Promise<ExtractionPreview> {
  const form = new FormData();
  form.append('file', buffer, { filename, contentType: mime });

  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/audio',
    form,
    {
      headers: {
        'x-user-id': userId,
        ...form.getHeaders(),
      },
    },
  );
  return data;
}

export async function confirmPreview(
  api: ApiClient,
  userId: string,
  previewId: string,
): Promise<ProcessResult> {
  const { data } = await api.post<ProcessResult>(
    '/ingestion/confirm',
    { preview_id: previewId },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function cancelPreview(
  api: ApiClient,
  userId: string,
  previewId: string,
): Promise<void> {
  await api.post(
    '/ingestion/cancel',
    { preview_id: previewId },
    { headers: { 'x-user-id': userId } },
  );
}

export async function removePreviewItem(
  api: ApiClient,
  userId: string,
  previewId: string,
  itemId: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/remove-item',
    { preview_id: previewId, item_id: itemId },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function resolveAmbiguous(
  api: ApiClient,
  userId: string,
  previewId: string,
  itemId: string,
  ingredientId: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/resolve-ambiguous',
    { preview_id: previewId, item_id: itemId, ingredient_id: ingredientId },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function addCustomItem(
  api: ApiClient,
  userId: string,
  previewId: string,
  itemId: string,
  name: string,
  nameUa?: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/add-custom-item',
    { preview_id: previewId, item_id: itemId, name, name_ua: nameUa },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function replacePreviewItem(
  api: ApiClient,
  userId: string,
  previewId: string,
  itemId: string,
  name: string,
  nameUa?: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/replace-item',
    { preview_id: previewId, item_id: itemId, name, name_ua: nameUa },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}

export async function changePreviewItemAmount(
  api: ApiClient,
  userId: string,
  previewId: string,
  itemId: string,
  text: string,
): Promise<ExtractionPreview> {
  const { data } = await api.post<ExtractionPreview>(
    '/ingestion/preview/change-amount',
    { preview_id: previewId, item_id: itemId, text },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}
