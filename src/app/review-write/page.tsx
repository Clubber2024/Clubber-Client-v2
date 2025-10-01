'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewCategory from '@/components/features/club/review/write/ReviewCategory';
import ReviewComment from '@/components/features/club/review/write/ReviewComment';
import { postReviewWrite } from '@/components/features/club/review/api/reviewWrite';
import Modal from '@/components/common/Modal';

export default function ReviewWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'category' | 'comment'>('category');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
    showConfirmButton: false,
  });

  // URL에서 clubId를 가져오기
  const clubId = searchParams.get('clubId');
  const clubIdNumber = clubId ? parseInt(clubId, 10) : null;

  // clubId가 없으면 에러 처리
  useEffect(() => {
    if (!clubIdNumber || isNaN(clubIdNumber)) {
      setModal({
        isOpen: true,
        message: '잘못된 동아리 정보입니다.',
        showConfirmButton: false,
      });
    }
  }, [clubIdNumber]);

  const handleCategoryNext = (keywords: string[]) => {
    setSelectedKeywords(keywords);
    setCurrentStep('comment');
  };

  const handleCommentBack = () => {
    setCurrentStep('category');
  };

  const handleCommentNext = async (commentText: string) => {
    if (!clubIdNumber) {
      setModal({
        isOpen: true,
        message: '잘못된 동아리 정보입니다.',
        showConfirmButton: false,
      });
      return;
    }

    setComment(commentText);
    setIsSubmitting(true);

    try {
      await postReviewWrite(clubIdNumber, {
        content: commentText,
        keywords: selectedKeywords,
        authImage: '', // 이미지 기능이 구현되면 실제 이미지 URL로 교체
      });

      // 성공 시 Modal 표시
      setModal({
        isOpen: true,
        message: '리뷰가 성공적으로 작성되었습니다!',
        showConfirmButton: false,
      });
    } catch (error: unknown) {
      console.error('리뷰 작성 실패:', error);

      // API 에러 메시지 처리
      let errorMessage = '리뷰 작성에 실패했습니다. 다시 시도해주세요.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMessage = (error as { message: string }).message;
      }

      setModal({
        isOpen: true,
        message: errorMessage,
        showConfirmButton: false,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setModal({ isOpen: false, message: '', showConfirmButton: false });
    // 성공한 경우에만 해당 동아리 상세 페이지의 리뷰 탭으로 리다이렉트
    if (modal.message.includes('성공적으로') && clubIdNumber) {
      router.push(`/clubInfo?clubId=${clubIdNumber}&tab=review`);
    }
  };

  const handleModalConfirm = () => {
    setModal({ isOpen: false, message: '', showConfirmButton: false });
  };

  return (
    <div className="min-h-screen py-8">
      {currentStep === 'category' && <ReviewCategory onNext={handleCategoryNext} />}
      {currentStep === 'comment' && (
        <ReviewComment
          selectedKeywords={selectedKeywords}
          onBack={handleCommentBack}
          onNext={handleCommentNext}
          isSubmitting={isSubmitting}
        />
      )}

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        showConfirmButton={modal.showConfirmButton}
      />
    </div>
  );
}
