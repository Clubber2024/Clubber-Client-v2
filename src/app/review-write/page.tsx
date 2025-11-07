'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import ReviewCategory from '@/components/features/club/review/write/ReviewCategory';
import ReviewComment from '@/components/features/club/review/write/ReviewComment';
import { postReviewWrite, getUserReviews } from '@/components/features/club/review/api/reviewWrite';
import Modal from '@/components/common/Modal';
import { getAccessToken, getIsAdmin } from '@/auth/AuthService';

function ReviewWriteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState<'category' | 'comment'>('category');
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    message: string;
    showConfirmButton: boolean;
    confirmText?: string;
    cancelText?: string;
  }>({
    isOpen: false,
    message: '',
    showConfirmButton: false,
  });
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  // URL에서 clubId를 가져오기
  const clubId = searchParams.get('clubId');
  const clubIdNumber = clubId ? parseInt(clubId, 10) : null;

  const checkExistingReview = useCallback(async (clubId: number) => {
    try {
      const userReviewsData = await getUserReviews();
      const foundExistingReview = userReviewsData.userReviews.some(
        (review) => review.clubId === clubId
      );

      if (foundExistingReview) {
        setHasExistingReview(true);
        setModal({
          isOpen: true,
          message:
            '이미 이 동아리에 리뷰를 작성하셨습니다. <br/> 한 동아리에는 리뷰를 하나만 작성할 수 있어요.',
          showConfirmButton: true,
          confirmText: '나의 리뷰',
          cancelText: '닫기',
        });
      }
      setIsAuthChecked(true);
    } catch {
      // 에러 발생 시에도 인증 체크는 완료로 처리
      setIsAuthChecked(true);
    }
  }, []);

  // 로그인 및 관리자 여부 확인, 리뷰 중복 확인
  useEffect(() => {
    const accessToken = getAccessToken();
    const isAdmin = getIsAdmin();

    // 관리자인 경우
    if (isAdmin) {
      setModal({
        isOpen: true,
        message: '관리자는 리뷰 작성이 불가능합니다.',
        showConfirmButton: false,
      });
      setIsAuthChecked(true);
      return;
    }

    // 로그인 안 된 경우
    if (!accessToken) {
      setModal({
        isOpen: true,
        message: '로그인이 필요한 서비스입니다.<br/>로그인 화면으로 이동할까요?',
        showConfirmButton: true,
        confirmText: '확인',
        cancelText: '취소',
      });
      setIsAuthChecked(true);
      return;
    }

    // 로그인된 경우, 리뷰 중복 확인
    if (accessToken && clubIdNumber && !isNaN(clubIdNumber)) {
      checkExistingReview(clubIdNumber);
    } else {
      setIsAuthChecked(true);
    }
  }, [clubIdNumber, checkExistingReview]);

  // clubId가 없으면 에러 처리
  useEffect(() => {
    if (!isAuthChecked) return;

    if (!clubIdNumber || isNaN(clubIdNumber)) {
      setModal({
        isOpen: true,
        message: '잘못된 동아리 정보입니다.',
        showConfirmButton: false,
      });
    }
  }, [clubIdNumber, isAuthChecked]);

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
      setIsSuccess(true);
      setModal({
        isOpen: true,
        message: '리뷰가 성공적으로 작성되었습니다!',
        showConfirmButton: false,
      });
    } catch (error: unknown) {
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

  const handleModalConfirm = () => {
    // 로그인 모달에서 확인 버튼을 누른 경우
    const accessToken = getAccessToken();
    if (!accessToken && modal.message.includes('로그인이 필요한 서비스')) {
      router.push('/login');
      return;
    }
    // 나의 리뷰 버튼을 누른 경우
    if (modal.message.includes('이미 이 동아리에 리뷰를 작성하셨습니다')) {
      router.push('/mypage/reviews');
      setModal({
        isOpen: false,
        message: '',
        showConfirmButton: false,
      });
      return;
    }
    setModal({
      isOpen: false,
      message: '',
      showConfirmButton: false,
    });
  };

  const handleModalClose = () => {
    const wasSuccess = isSuccess;
    const accessToken = getAccessToken();
    const isAdmin = getIsAdmin();

    // 로그인 안 된 상태에서 취소 버튼을 누른 경우 이전 화면으로 이동
    if (!accessToken && modal.message.includes('로그인이 필요한 서비스')) {
      setModal({
        isOpen: false,
        message: '',
        showConfirmButton: false,
      });
      router.back();
      return;
    }

    // 관리자인 경우
    if (isAdmin) {
      setModal({
        isOpen: false,
        message: '',
        showConfirmButton: false,
      });
      router.back();
      return;
    }

    // 이미 리뷰를 작성한 동아리인 경우 - 닫기 버튼
    if (modal.message.includes('이미 이 동아리에 리뷰를 작성하셨습니다')) {
      setModal({
        isOpen: false,
        message: '',
        showConfirmButton: false,
      });
      router.back();
      return;
    }

    setModal({
      isOpen: false,
      message: '',
      showConfirmButton: false,
    });
    setIsSuccess(false);
    // 성공한 경우에만 해당 동아리 상세 페이지의 리뷰 탭으로 리다이렉트
    if (wasSuccess && clubIdNumber) {
      router.push(`/clubInfo?clubId=${clubIdNumber}&tab=review`);
    }
  };

  const shouldShowReviewForm =
    isAuthChecked && getAccessToken() && !getIsAdmin() && !hasExistingReview;

  return (
    <div className="min-h-screen py-8">
      {shouldShowReviewForm && (
        <>
          {currentStep === 'category' && <ReviewCategory onNext={handleCategoryNext} />}
          {currentStep === 'comment' && (
            <ReviewComment
              selectedKeywords={selectedKeywords}
              onBack={handleCommentBack}
              onNext={handleCommentNext}
              isSubmitting={isSubmitting}
            />
          )}
        </>
      )}

      <Modal
        isOpen={modal.isOpen}
        message={modal.message}
        onClose={handleModalClose}
        onConfirm={handleModalConfirm}
        showConfirmButton={modal.showConfirmButton}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </div>
  );
}

export default function ReviewWritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen py-8">로딩 중...</div>}>
      <ReviewWriteContent />
    </Suspense>
  );
}
