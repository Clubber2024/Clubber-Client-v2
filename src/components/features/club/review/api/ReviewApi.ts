import { apiClient } from '@/lib/apiClient';

//리뷰 통계
export const getReviewsSortedByCount = async (clubId: number,limit:number) => {
  try {
    const res = await apiClient.get(`/v1/clubs/${clubId}/reviews/keyword-stats?limit=${limit}`);
    if (res.data.success) {
      const reviews = res.data.data.keywordStats;
      console.log('reviews:', reviews);

      const sortedReviews = Object.entries(reviews)
        .sort(([, countA], [, countB]) => (countB as number) - (countA as number)) // value 값 내림차순
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}); // Convert back to object
      console.log('sorted:', sortedReviews);

      return sortedReviews;
    } else {
      console.error('Failed to fetch reviews');
      return null;
    }
  } catch (error) {
    console.error('Error fetching reviews: ', error);
    return null;
  }
};

interface ReviewRequest {
  clubId: number;
  page: number;
  size: number;
  // sort: string;
  reviewSortType: string;
}

//한줄평 리뷰 리스트 조회
export const getReviews = async ({ clubId, page, size, reviewSortType }: ReviewRequest) => {
  try {
    const res = await apiClient.get(
      `/v1/clubs/${clubId}/reviews?page=${page}&size=${size}&sort=string&reviewSortType=${reviewSortType}`
    );
    console.log('res:', res.data.data);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching reviews: ', error);
    return null;
  }
};

//리뷰 좋아요 등록
export const postReviewLike = async (clubId: number, id: number) => {
  try {
    const res = await apiClient.post(`/v1/clubs/${clubId}/reviews/like/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error posting review like: ', error);
    return null;
  }
};

//리뷰 좋아요 삭제
export const deleteReviewLike = async (clubId: number, id: number) => {
  try {
    const res = await apiClient.delete(`/v1/clubs/${clubId}/reviews/like/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('Error deleting review like: ', error);
    return null;
  }
};

interface ReviewReportRequest {
  clubId: number;
  id: number; //리뷰 id
  reportReason: string;
  detailReason: string | null;
}

//리뷰 신고 등록
export const postReviewReport = async ({
  clubId,
  id,
  reportReason,
  detailReason,
}: ReviewReportRequest) => {
  try {
    const res = await apiClient.post(`/v1/clubs/${clubId}/reviews/report/${id}`, {
      reportReason: reportReason,
      detailReason: detailReason,
    });

    if (res.data.success) {
      return res.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error posting review report: ', error);
    return null;
  }
};
