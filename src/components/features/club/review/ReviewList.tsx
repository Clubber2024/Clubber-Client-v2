import { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import { getReviews } from "./api/ReviewApi";

export default function ReviewList({ clubId }: { clubId: number }) {
  const [sort, setSort] = useState('인기순');
  const [reviews, setReviews] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [nextPage, setNextPage] = useState(false);

  useEffect(() => {
    getReviews(clubId).then(res => {
      setReviews(res.reviews.content);
      setTotalPages(res.reviews.totalPages);
      setPageSize(res.reviews.size);
      setCurrentPage(res.reviews.page);
      setNextPage(res.reviews.hasNextPage);
    });
  }, [clubId]);
  return (
    <div className="flex flex-col gap-2 w-[80%] mx-auto mt-5">
      <div className="flex flex-row gap-2 justify-end">
        <p 
          className={`${sort==='인기순'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('인기순')}
        >
          인기순
        </p>
        <p 
          className={`${sort==='최신순'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('최신순')}
        >
          최신순
        </p>
        <p 
          className={`${sort==='오래된순'?'text-[#202123] font-semibold':'text-[#707070]'} text-[14px] font-regular cursor-pointer hover:text-[#202123]/80 transition-all duration-300 hover:font-semibold`} 
          onClick={() => setSort('오래된순')}
        >
          오래된순
        </p>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <ReviewCard />
        <ReviewCard />
        <ReviewCard />
      </div>
    </div>
  );
}
