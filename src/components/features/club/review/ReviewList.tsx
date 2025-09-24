import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getReviews } from "./api/ReviewApi";

export default function ReviewList({ clubId }: { clubId: number }) {
  const [sort, setSort] = useState('LIKE');
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [nextPage, setNextPage] = useState(false);

  const sortOptions = {
    LIKE: '좋아요순',
    LATEST: '최신순',
    OLDEST: '오래된순',
  }

  const fetchReviews = async () => {
    const res = await getReviews({clubId, page: currentPage, size: pageSize, reviewSortType: sort});
    if (res) {
      setReviews(res.reviews.content);
      setTotalPages(res.reviews.totalPages);
      setPageSize(res.reviews.size);
      setCurrentPage(res.reviews.page);
      setNextPage(res.reviews.hasNextPage);
      console.log(res.reviews.content);
    }
  };

  useEffect(() => {
    if (!clubId || isNaN(clubId)) {
      console.error('Invalid clubId:', clubId);
      return;
    }
    
    fetchReviews();
  }, [clubId, sort, currentPage, pageSize]);
          

  return (
    <div className="flex flex-col gap-2 w-[80%] mx-auto mt-5">
      <div className="flex flex-row gap-2 justify-end">
        <p 
          className={`${sort==='LIKE'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('LIKE')}
        >
          {sortOptions.LIKE}
        </p>
        <p 
          className={`${sort==='LATEST'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('LATEST')}
        >
          {sortOptions.LATEST}
        </p>
        <p 
          className={`${sort==='OLDEST'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('OLDEST')}
        >
          {sortOptions.OLDEST}
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {reviews.length > 0 ? (
          reviews.map((review: any, index: number) => (
            <ReviewCard key={index} review={review} clubId={clubId} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            아직 리뷰가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
