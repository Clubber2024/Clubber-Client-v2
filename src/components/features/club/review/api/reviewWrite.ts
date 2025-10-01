import { apiClient } from '@/lib/apiClient';
import { ReviewKeyword } from '@/types/review/reviewKeyword';
import { ReviewRequest } from '@/types/review/reviewRequest';

export const getReviewKeyword = async (): Promise<ReviewKeyword[]> => {
  const res = await apiClient.get('/v1/keywords');
  return res.data.data;
};

export const postReviewWrite = async (clubId: number, reviewData: ReviewRequest): Promise<void> => {
  const res = await apiClient.post(`/v1/clubs/${clubId}/reviews`, reviewData);
  return res.data.data;
};
