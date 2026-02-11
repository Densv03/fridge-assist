import { ApiClient } from './api-client';
import { InventoryItem } from './types';

export async function getInventory(
  api: ApiClient,
  userId: string,
): Promise<InventoryItem[]> {
  const { data } = await api.get<InventoryItem[]>('/inventory', {
    headers: { 'x-user-id': userId },
  });
  return data;
}
