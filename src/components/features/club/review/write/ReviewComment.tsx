'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ReviewCommentProps {
  selectedKeywords: string[];
  onBack: () => void;
  onNext: (comment: string) => void;
  isSubmitting?: boolean;
}

export default function ReviewComment({
  // selectedKeywords,
  // onBack,
  onNext,
  isSubmitting = false,
}: ReviewCommentProps) {
  const [comment, setComment] = useState('');

  const handleNext = () => {
    if (comment.length >= 10) {
      onNext(comment);
    }
  };

  const isCommentValid = comment.length >= 10;

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center mb-8 gap-1">
        <h2 className="text-lg font-bold">한줄평을 써주세요!</h2>
        <p className="text-sm text-[#707070] font-medium">자유롭게 느낀 점을 짧게 남겨주세요.</p>
      </div>

      <div className="w-[90%] max-w-2xl">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="리뷰를 작성해주세요! (필수 10자이상)"
          className="w-full h-11 py-3 px-4 text-[#767676] text-sm resize-none border border-gray-300 rounded-sm shadow-[0_0_2px_0_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent scrollbar-hide "
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!isCommentValid || isSubmitting}
        className={`w-50 mx-auto text-white text-sm font-semibold rounded-[3px] mt-8 ${
          isCommentValid && !isSubmitting
            ? 'bg-primary hover:bg-primary/90 cursor-pointer'
            : 'bg-[#BABABA] cursor-not-allowed'
        }`}
      >
        {isSubmitting ? '제출 중...' : '다음'}
      </Button>
    </div>
  );
}
