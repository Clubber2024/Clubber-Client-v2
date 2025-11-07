'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNext = () => {
    if (comment.length >= 10) {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    if (isConfirmed) {
      onNext(comment);
      setIsModalOpen(false);
      setIsConfirmed(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsConfirmed(false);
  };

  const isCommentValid = comment.length >= 10;

  return (
    <>
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

      {/* 등록 전 확인 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 mx-4 max-w-md w-full">
            {/* 제목 */}
            <h3 className="text-lg font-bold text-center mb-4">안내</h3>

            {/* 경고 메시지 */}
            <div className="flex flex-col items-center justify-center mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-black">리뷰 작성 전, 꼭 확인해주세요!</p>
              </div>
              <p className="text-sm text-center text-black">
                허위 또는 악성 리뷰는 신고 시 숨김 처리되며,
                <br /> 서비스 이용 제한 등의 조치가 취해질 수 있습니다.
              </p>
            </div>

            {/* 확인 문구 */}
            <p className="text-sm text-center font-semibold text-black mb-4">
              저는 이 동아리의 실제 회원이며, <br /> 직접 경험을 바탕으로 리뷰를 작성합니다.
            </p>

            {/* 체크박스 */}
            <label className="flex items-center justify-center gap-2 cursor-pointer mb-6">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className={`text-sm ${isConfirmed ? 'text-black' : 'text-gray-500'}`}>
                네, 위 내용을 확인했습니다
              </span>
            </label>

            {/* 버튼 */}
            <div className="flex gap-2">
              <Button
                onClick={handleConfirm}
                disabled={!isConfirmed}
                className={`flex-1 text-sm font-medium rounded ${
                  isConfirmed
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                등록
              </Button>
              <Button
                onClick={handleCancel}
                className="flex-1 text-sm font-medium rounded bg-gray-200 text-black hover:bg-gray-300"
              >
                취소
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
