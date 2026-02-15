import { ApiClient } from './api-client';
import { ReportResult } from './types';

export async function createReport(
  api: ApiClient,
  userId: string,
  type: 'bug' | 'idea',
  description: string,
): Promise<ReportResult> {
  const { data } = await api.post<ReportResult>(
    '/reports',
    { type, description },
    { headers: { 'x-user-id': userId } },
  );
  return data;
}
