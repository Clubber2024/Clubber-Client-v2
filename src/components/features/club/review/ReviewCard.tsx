import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Ellipsis, ThumbsUp } from 'lucide-react';
import { postReviewLike } from './api/ReviewApi';
import ReviewStatics from './ReviewStatics';

interface ReviewCardProps {
  clubId?: number;
  review?: {
    reviewId?: number;
    dateTime?: string;
    content?: string;
    keywords?: string[];
    likes?: number;
    reportStatus?: "HIDDEN" | "VISIBLE";
  };
}

export default function ReviewCard({ review, clubId }: ReviewCardProps) {
  const isHidden = review?.reportStatus === "HIDDEN";

  const handleLike = async () => {
    console.log(clubId, review?.reviewId);
    if (!clubId || !review?.reviewId) return;
    
    const res = await postReviewLike(clubId, review?.reviewId);
    if (res) {
      console.log(res);
    }
  };

  return (
    <Card className="relative">
      <div className={isHidden ? "blur-xs" : ""}>
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-1 items-center">
            <CardTitle className="text-[16px] font-bold mr-1">
              {review?.reviewId? `익명${review?.reviewId}` : '익명'}
            </CardTitle>
            <p className="text-[12px] font-regular text-[#9c9c9c]">
              {review?.dateTime || ''}
            </p>
            {review?.likes && review?.likes > 0 && (
            <span className="flex flex-row gap-0.5 items-center ml-0.5">
            <ThumbsUp size={12} className="text-[#fd3c56]"/>
            <p className="text-[12px] font-regular text-[#fd3c56]">{review?.likes}</p>
            </span>
            )}

          </div>
          <div className="flex flex-row gap-2 items-center"> <span className="text-[12px] font-regular text-[#9c9c9c] flex flex-row gap-1 items-center cursor-pointer" onClick={handleLike}> <ThumbsUp size={12}/>추천</span> <span className="text-[12px] font-regular text-[#9c9c9c] flex flex-row gap-1 items-center cursor-pointer">신고</span></div>
        </CardHeader>
        <CardContent>
          <p>{review?.content || ''}</p>
          <div className="flex flex-row flex-wrap gap-1">
            {review?.keywords?.map((keyword, index) => (
              <p key={index} className="text-[14px] font-regular gap-3 w-fit h-[34px] bg-[#f6f6f8] rounded-[5px] px-3 py-2">
                {keyword}
              </p>
            ))}
           
          </div>
        </CardContent>
      </div>
      
      {isHidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <p className="text-[16px] font-medium text-[#707070]">
            이 댓글은 운영 정책 위반으로 신고되어 숨김 처리되었습니다.
          </p>
        </div>
      )}
    </Card>
  );
}
