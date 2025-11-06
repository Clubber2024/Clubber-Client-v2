import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Ellipsis, ThumbsUp } from 'lucide-react';
import { deleteReviewLike, postReviewLike, postReviewReport } from './api/ReviewApi';
import ReviewStatics from './ReviewStatics';
import { useState } from 'react';
import Modal from '@/app/modal/Modal';
import { Button } from '@/components/ui/button';

interface ReviewCardProps {
  clubId?: number;
  review?: {
    reviewId?: number;
    dateTime?: string;
    content?: string;
    keywords?: string[];
    likes?: number;
    liked?: boolean;
    reportStatus?: "HIDDEN" | "VISIBLE";
  };
}

export default function ReviewCard({ review, clubId }: ReviewCardProps) {
  const [reviews, setReviews] = useState(review);
  const isHidden = reviews?.reportStatus === "HIDDEN";
  const [isOpenReport, setIsOpenReport] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [otherDetailReason, setOtherDetailReason] = useState<string|null>(null);

  const handleLike = async () => {
    console.log(clubId, reviews?.reviewId);
    if (!clubId || !reviews?.reviewId) return;
    
    // 즉시 UI 업데이트
    setReviews({
      ...reviews,
      liked: true,
      likes: (reviews?.likes || 0) + 1
    });
    
    const res = await postReviewLike(clubId, reviews?.reviewId);
    if (res) {
      console.log(res);
    }
  };

  const deleteLike = async () => {
    if (!clubId || !reviews?.reviewId) return;
    
    // 즉시 UI 업데이트
    setReviews({
      ...reviews,
      liked: false,
      likes: Math.max((reviews?.likes || 0) - 1, 0)
    });
    
    const res = await deleteReviewLike(clubId, reviews?.reviewId);
    if (res) {
      console.log(res);
    }
  };


  const handleReport = async () => {
    if (!clubId || !reviews?.reviewId) return;
    const res = await postReviewReport({clubId, id: reviews?.reviewId, reportReason, detailReason: otherDetailReason});
    if (res) {
      console.log(res);
    }
  };

  const handleCloseReport = () => {
    setIsOpenReport(false);
    setReportReason('');
    setOtherDetailReason(null);
  };

  return (
    <Card className="relative">
      <div className={isHidden ? "blur-xs" : ""}>
        <CardHeader className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-1 items-center">
            <CardTitle className="text-[16px] font-bold mr-1">
              {reviews?.reviewId? `익명${reviews?.reviewId}` : '익명'}
            </CardTitle>
            <p className="text-[12px] font-regular text-[#9c9c9c]">
              {reviews?.dateTime || ''}
            </p>
            {reviews?.likes && reviews?.likes > 0 && (
            <span className="flex flex-row gap-0.5 items-center ml-0.5">
            <ThumbsUp size={12} className="text-[#fd3c56]"/>
            <p className="text-[12px] font-regular text-[#fd3c56]">{reviews?.likes}</p>
            </span>
            )}

          </div>
          <div className="flex flex-row gap-2 items-center"> 
           
             {reviews?.liked?  <span className="text-[12px] font-regular text-[#FD3C56] flex flex-row gap-1 items-center cursor-pointer" onClick={deleteLike}> <ThumbsUp size={12}/>추천 </span>: <span className="text-[12px] font-regular text-[#9c9c9c] flex flex-row gap-1 items-center cursor-pointer" onClick={handleLike}> <ThumbsUp size={12}/>추천 </span>}
             
             
            <span className="text-[12px] font-regular text-[#9c9c9c] flex flex-row gap-1 items-center cursor-pointer" onClick={() => setIsOpenReport(true)}>
              신고
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p>{reviews?.content || ''}</p>
          <div className="flex flex-row flex-wrap gap-1">
            {reviews?.keywords?.map((keyword, index) => (
              <p key={index} className="text-[14px] font-regular gap-3 w-fit h-[34px] bg-[#f6f6f8] rounded-[5px] px-3 py-2">
                {keyword}
              </p>
            ))}
           
          </div>
        </CardContent>
      </div>
      
      {isHidden && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <p className="text-[16px] font-medium text-[#707070] mx-5 sm:mx-0">
            이 댓글은 운영 정책 위반으로 신고되어 숨김 처리되었습니다.
          </p>
        </div>
      )}

      {isOpenReport && (
         <div
         className="fixed flex inset-0 bg-black/50 z-50 justify-center items-center"
        
       >
        <div
                className={`fixed z-100 bg-white rounded-lg shadow-lg p-5 flex flex-col items-center text-left py-[35px] ${
              'w-[100%] md:w-[80%] max-w-[813px] h-[410px]' 
                }`}
                role="dialog"
                aria-modal="true"
              >
          <p className="text-[24px] font-semibold">신고하기</p>
          <div className="w-full px-5 sm:px-15 mt-4">
            <p className="text-[18px] font-semibold mb-4">신고사유</p>
            <div className="flex flex-col gap-3 mb-3">
              {[
                { label: '욕설 및 비방', value: 'ABUSE' },
                { label: '허위 정보', value: 'FALSE_INFORMATION' },
                { label: '광고 및 스팸', value: 'ADVERTISEMENT_SPAM' },
                { label: '개인정보 포함', value: 'PERSONAL_INFORMATION' },
                { label: '기타', value: 'OTHER' },
              ].map((option) => (
                <div key={option.value} className="flex flex-row gap-2">
                  {reportReason === option.value ? (
                    <img
                      src={`/images/admin/check-circle.png`}
                      alt={`${option.label} 선택됨`}
                      onClick={() => setReportReason(option.value)}
                      className="w-[16px] h-[16px] cursor-pointer"
                    />
                  ) : (
                    <input
                      type="radio"
                      id={option.value}
                      name="report"
                      value={option.value}
                      checked={reportReason === option.value}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-[16px] h-[16px] appearance-none border border-gray-400 rounded-[25px] cursor-pointer"
                    />
                  )}
                  <label htmlFor={option.value} className="text-[16px] font-pretendard font-normal leading-none tracking-normal cursor-pointer" onClick={() => setReportReason(option.value)}>
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
            <input type="text" id="etc" name="etc" value={otherDetailReason ?? ''} onChange={(e) => {reportReason==='OTHER'? setOtherDetailReason(e.target.value) : setOtherDetailReason(null)}} placeholder="비방, 욕설, 광고, 잘못된 정보 등 신고 사유를 구체적으로 작성해주세요." className="w-full h-[48px] rounded-[5px] border border-[d6d6d6] px-3 py-2 text-[14px]" />
          </div>
          <div className="flex flex-row gap-2 w-full px-5 sm:px-15 mt-5">
            <Button className="w-1/2 h-[48px] rounded-[5px] text-[16px]" onClick={handleReport}>신고하기</Button>
            <Button className="w-1/2 h-[48px] rounded-[5px] text-[16px]" variant={"cancel"} onClick={handleCloseReport}>취소</Button>
          </div>
        </div>
      </div>
      )}
    </Card>
  );
}