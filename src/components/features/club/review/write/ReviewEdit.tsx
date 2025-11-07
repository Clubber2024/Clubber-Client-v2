'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface ReviewEditProps {
  keywords: string[];
  initialContent: string;
  onSubmit: (content: string) => void;
  isSubmitting?: boolean;
  clubId: number | null;
}

export default function ReviewEdit({
  keywords,
  initialContent,
  onSubmit,
  isSubmitting = false,
}: ReviewEditProps) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleSubmit = () => {
    if (content.length >= 10) {
      onSubmit(content);
    } else {
      // 10자 미만일 때 피드백 (선택사항)
      alert('리뷰는 최소 10자 이상 작성해주세요.');
    }
  };

  const isContentValid = content.length >= 10;

  const formatKeyword = (keyword: string) => {
    return keyword;
  };

  return (
    <div className="flex flex-col gap-6 px-4">
      {/* 선택 카테고리 -> 일단 보여주기만 */}
      <div>
        <h3 className="text-[18px] font-semibold mb-3">선택 키워드</h3>
        <div className="flex flex-row flex-wrap gap-1">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="text-[14px] font-regular w-fit h-[34px] bg-[#f6f6f8] rounded-[5px] px-3 py-2 flex items-center"
            >
              {formatKeyword(keyword)}
            </div>
          ))}
        </div>
      </div>

      {/* 한줄평 */}
      <div>
        <h3 className="text-[18px] font-semibold mb-3">후기</h3>
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="리뷰를 작성해주세요! (필수 10자이상)"
          className="w-full h-11 py-3 px-4 text-[#767676] text-sm border border-gray-300 rounded-sm shadow-[0_0_2px_0_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* 등록 */}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={!isContentValid || isSubmitting}
        className={`w-full h-[48px] rounded-[5px] text-[16px] font-semibold text-white ${
          isContentValid && !isSubmitting
            ? 'bg-primary hover:bg-primary/90 cursor-pointer'
            : 'bg-[#BABABA] cursor-not-allowed'
        }`}
      >
        {isSubmitting ? '등록 중...' : '등록'}
      </Button>
    </div>
  );
}
