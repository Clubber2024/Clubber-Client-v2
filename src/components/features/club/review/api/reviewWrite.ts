import { apiClient } from '@/lib/apiClient';
import { ReviewKeyword } from '@/types/review/reviewKeyword';
import { ReviewRequest } from '@/types/review/reviewRequest';

export interface UserReview {
  reviewId: number;
  clubId: number;
  clubName: string;
  dateTime: string;
  keywords: string[];
  content: string;
  reportStatus: string;
}

export interface UserReviewsResponse {
  userId: number;
  userReviews: UserReview[];
}

export const getReviewKeyword = async (): Promise<ReviewKeyword[]> => {
  const res = await apiClient.get('/v1/keywords');
  return res.data.data;
};

export const getUserReviews = async (): Promise<UserReviewsResponse> => {
  const res = await apiClient.get('/v1/users/review');
  return res.data.data;
};

export const postReviewWrite = async (clubId: number, reviewData: ReviewRequest): Promise<void> => {
  const res = await apiClient.post(`/v1/clubs/${clubId}/reviews`, reviewData);
  return res.data.data;
};
