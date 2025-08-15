import { apiClient } from '@/lib/apiClient';
import { SummaryResponse } from '@/types/summary/summaryData';

export const getSummaryData = async () => {
  const response = await apiClient.get<SummaryResponse>('/v1/clubs/summary');
  return response.data.data;
};
