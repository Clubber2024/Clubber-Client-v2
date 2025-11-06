import { useEffect, useState, useCallback } from 'react';
import ReviewCard from './ReviewCard';
import { getReviews } from './api/ReviewApi';
import { getUserReviews } from './api/reviewWrite';
import { getAccessToken } from '@/auth/AuthService';

interface Review {
  reviewId?: number;
  dateTime?: string;
  content?: string;
  keywords?: string[];
  likes?: number;
  reportStatus?: 'HIDDEN' | 'VISIBLE';
}

export default function ReviewList({ clubId }: { clubId: number }) {
  const [sort, setSort] = useState('LIKE');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [userReviewIds, setUserReviewIds] = useState<Set<number>>(new Set());

  const sortOptions = {
    LIKE: '좋아요순',
    ASC: '최신순',
    DESC: '오래된순',
  };

  const fetchUserReviews = async () => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setUserReviewIds(new Set());
      return;
    }

    try {
      const userReviewsData = await getUserReviews();
      const reviewIds = new Set(userReviewsData.userReviews.map((review) => review.reviewId));
      setUserReviewIds(reviewIds);
    } catch {
      setUserReviewIds(new Set());
    }
  };


  const fetchReviews = useCallback(async () => {
    const res = await getReviews({
      clubId,
      page: currentPage,
      size: pageSize,
      reviewSortType: sort,
    });
    if (res) {
      setReviews(res.reviews.content);
      setPageSize(res.reviews.size);
      setCurrentPage(res.reviews.page);
    }
  }, [clubId, sort, currentPage, pageSize]);

  useEffect(() => {
    if (!clubId || isNaN(clubId)) {
      return;
    }

    fetchUserReviews();
    fetchReviews();
  }, [clubId, sort, currentPage, pageSize, fetchReviews]);

  const handleReviewDeleted = () => {
    fetchUserReviews();
    fetchReviews();
  };

  return (
    <div className="flex flex-col gap-2 w-[100%] sm:w-[80%] mx-auto mt-5">
      <div className="flex flex-row gap-2 justify-end">
        <p
          className={`${sort === 'LIKE' ? 'text-[#202123] font-semibold' : 'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`}
          onClick={() => setSort('LIKE')}
        >
          {sortOptions.LIKE}
        </p>

        <p 
          className={`${sort==='ASC'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('ASC')}
        >
          {sortOptions.ASC}
        </p>

        <p 
          className={`${sort==='DESC'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('DESC')}

        >
          {sortOptions.DESC}
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {reviews.length > 0 ? (
          reviews.map((review: Review, index: number) => {
            const isOwnReview = review?.reviewId ? userReviewIds.has(review.reviewId) : false;
            return (
              <ReviewCard
                key={index}
                review={review}
                clubId={clubId}
                isOwnReview={isOwnReview}
                onReviewDeleted={handleReviewDeleted}
              />
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-8">아직 리뷰가 없습니다.</div>
        )}
      </div>
    </div>
  );
}
