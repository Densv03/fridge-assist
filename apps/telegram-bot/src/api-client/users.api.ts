import { ApiClient } from './api-client';
import { ResolvedUser } from './types';

export async function resolveUser(
  api: ApiClient,
  telegramUserId: number,
  firstName: string,
  lastName?: string,
  phone?: string,
): Promise<ResolvedUser> {
  const name = lastName ? `${firstName} ${lastName}` : firstName;
  const { data } = await api.post<ResolvedUser>('/users/resolve', {
    provider: 'telegram',
    provider_user_id: String(telegramUserId),
    name,
    ...(phone && { phone }),
  });
  return data;
}

export async function getAllUsers(api: ApiClient): Promise<ResolvedUser[]> {
  const { data } = await api.get<ResolvedUser[]>('/users');
  return data;
}

export async function updateUser(
  api: ApiClient,
  userId: string,
  updates: { phone?: string; preferred_language?: string },
): Promise<ResolvedUser> {
  const { data } = await api.patch<ResolvedUser>(`/users/${userId}`, updates);
  return data;
}
