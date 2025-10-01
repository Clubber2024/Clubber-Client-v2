import { PencilLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getReviewsSortedByCount } from './api/ReviewApi';

import Link from 'next/link';

type ReviewKeywordStats = Record<string, number>;

export default function ReviewStatics({ clubId }: { clubId: number }) {
  const [reviews, setReviews] = useState<ReviewKeywordStats>({});

  useEffect(() => {
    const getReviewsSortedByCountApi = async () => {
      const res = await getReviewsSortedByCount(clubId);
      if (res) {
        setReviews(res as ReviewKeywordStats);
      }
    };

    if (clubId && !isNaN(clubId)) {
      getReviewsSortedByCountApi();
    }
  }, [clubId]);

  // clubId가 유효하지 않으면 조건부 렌더링
  if (!clubId || isNaN(clubId)) {
    return <div>잘못된 클럽 ID입니다.</div>;
  }

  const sortedReviews = Object.entries(reviews);

  const PercentageBar = ({
    text,
    count,
    total,
  }: {
    text: string;
    count: number;
    total: number;
  }) => {
    const percentage = (count / total) * 100;
    const barColor =
      percentage === 0
        ? 'bg-[#f2f2f2]'
        : `rgba(113, 177, 221, ${Math.min(0.3 + count / total, 1)})`;

    return (
      <div className="h-[50px] w-full bg-[#f2f2f2] rounded-[10px] overflow-hidden relative">
        <div
          className="h-full bg-[#f2f2f2] flex items-center px-2 rounded-[12px] md:justify-start justify-between"
          style={{ width: `${percentage}%`, backgroundColor: barColor }}
        >
          <span className="text-black bg-transparent whitespace-nowrap overflow-visible pl-[7px] md:text-[15px] text-[12.5px] md:font-bold font-semibold">
            {text}
          </span>
          <p className="text-[#71b1dd] bg-transparent font-bold absolute md:right-[15px] right-[14px] md:text-[14px] text-[13px]">
            {count}
          </p>
        </div>
      </div>
    );
  };
  const ReviewStats = ({ data }: { data: [string, number][] }) => {
    // reduce -> acc + curr.count (누적값) , 0 (초기값)
    const total = data.reduce((acc: number, curr: [string, number]) => acc + curr[1], 0);

    return (
      <div className="flex flex-col gap-2">
        {data.map(([text, count]: [string, number]) => (
          <PercentageBar key={text} text={text} count={count} total={total} />
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2 mx-auto w-full sm:w-[60%]">
      <div className="flex flex-row items-center justify-between mt-16">
        <h1 className="text-[24px] font-bold">이런 점이 좋았어요!</h1>
        <Link href={`/review-write?clubId=${clubId}`}>
          <p className="flex flex-row items-center text-[14px] font-regular text-[#1954b2] cursor-pointer hover:text-[#1954b2]/80 transition-all duration-300 hover:font-bold">
            <PencilLine className="text-[#1954b2] size-4" />
            리뷰쓰기
          </p>
        </Link>
      </div>
      <div>
        <ReviewStats data={sortedReviews} />
      </div>
    </div>
  );
}
