import { apiClient } from '@/lib/apiClient';
import { FaqResponse, FaqParams } from '@/types/community/faqData';

export const getFaqListData = async (params: FaqParams) => {
  const response = await apiClient.get<FaqResponse>('/v1/faqs', {
    params: params
  });
  
  return response.data;
};