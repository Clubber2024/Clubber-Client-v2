import { apiClient } from "@/lib/apiClient";

export const getReviewsSortedByCount = async (clubId: number) => {
  try {
      const res = await apiClient.get(`/v1/clubs/${clubId}/reviews/keyword-stats`);
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

export const getReviews = async (clubId: number) => {
  try {
      const res = await apiClient.get(`/v1/clubs/${clubId}/reviews`);
      console.log('res:', res.data.data);
      return res.data.data;
  } catch (error) {
      console.error('Error fetching reviews: ', error);
      return null;
  }
};