'use client';

import { useEffect, useState } from 'react';
import { getUserReviews, UserReview } from '@/components/features/club/review/api/reviewWrite';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';
import { ChevronLeft, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { deleteReview, patchReview } from '@/components/features/club/review/api/ReviewApi';
import Modal from '@/components/common/Modal';
import ReviewEdit from '@/components/features/club/review/write/ReviewEdit';

export default function MypageReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<number | null>(null);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const fetchMyReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userReviewsData = await getUserReviews();
      setReviews(userReviewsData.userReviews);
    } catch {
      setError('리뷰를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReviews();
  }, []);

  const handleReviewDeleted = () => {
    fetchMyReviews();
  };

  const handleEdit = (review: UserReview) => {
    setEditingReview(review);
  };

  const handleEditSubmit = async (content: string) => {
    if (!editingReview) return;

    setIsSubmitting(true);
    try {
      const res = await patchReview(editingReview.reviewId, content);
      if (res) {
        setIsSuccessModalOpen(true);
      } else {
        setError('리뷰 수정에 실패했습니다.');
      }
    } catch {
      setError('리뷰 수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false);
    setEditingReview(null);
    fetchMyReviews();
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
  };

  const handleDeleteClick = (reviewId: number) => {
    setSelectedReviewId(reviewId);
    setIsOpenDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!selectedReviewId) return;
    const res = await deleteReview(selectedReviewId);
    if (res) {
      setIsOpenDeleteModal(false);
      setSelectedReviewId(null);
      handleReviewDeleted();
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}.${month}.${day}`;
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 상단 헤더 바 - 전체 너비 */}
      <div
        className="bg-primary py-3 w-screen"
        style={{ marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)' }}
      >
        <div className="flex items-center gap-2 max-w-6xl mx-auto px-4">
          <button
            onClick={() => {
              if (editingReview) {
                handleCancelEdit();
              } else {
                router.back();
              }
            }}
            className="flex items-center text-gray-700 hover:text-gray-900 cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-lg font-medium">마이페이지</span>
        </div>
      </div>

      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {editingReview ? (
            /* 수정 모드 */
            <Card className="p-6">
              <ReviewEdit
                keywords={editingReview.keywords}
                initialContent={editingReview.content}
                onSubmit={handleEditSubmit}
                isSubmitting={isSubmitting}
                clubId={editingReview.clubId}
              />
            </Card>
          ) : (
            /* 리뷰 목록 모드 */
            <>
              {/* 제목 및 옵션 영역 */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-center mb-6">리뷰 목록</h1>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">리뷰 {reviews.length}</span>
                  </div>
                </div>
              </div>

              {/* 리뷰 목록 */}
              {reviews.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <Card key={review.reviewId} className="p-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                router.push(`/clubInfo?clubId=${review.clubId}&tab=review`)
                              }
                              className="text-md font-semibold text-primary hover:underline"
                            >
                              {review.clubName}
                            </button>
                            <span className="text-sm font-semibold text-gray-700">
                              익명{review.reviewId}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.dateTime)}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100">
                                <MoreVertical size={16} className="text-gray-500" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[120px]">
                              <DropdownMenuItem
                                onClick={() => handleEdit(review)}
                                className="cursor-pointer"
                              >
                                <Pencil size={16} className="mr-2 text-gray-500" />
                                수정하기
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(review.reviewId)}
                                className="cursor-pointer text-red-500"
                              >
                                <Trash2 size={16} className="mr-2" />
                                삭제하기
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* 리뷰 내용 */}
                        <p className="text-base text-gray-900">{review.content}</p>

                        {/* 키워드 태그 */}
                        {review.keywords && review.keywords.length > 0 && (
                          <div className="flex flex-row flex-wrap gap-2">
                            {review.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="text-sm px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-gray-700"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="py-12">
                  <div className="text-center text-gray-500">
                    <p className="text-lg mb-2">작성한 리뷰가 없습니다.</p>
                    <p className="text-sm">동아리에 대한 리뷰를 작성해보세요.</p>
                  </div>
                </Card>
              )}
            </>
          )}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {isOpenDeleteModal && (
        <Modal
          isOpen={isOpenDeleteModal}
          message="정말 리뷰를 삭제하시겠습니까?"
          onClose={() => {
            setIsOpenDeleteModal(false);
            setSelectedReviewId(null);
          }}
          onConfirm={handleDelete}
          showConfirmButton={true}
          confirmText="삭제"
          cancelText="취소"
        />
      )}

      {/* 수정 성공 모달 */}
      {isSuccessModalOpen && (
        <Modal
          isOpen={isSuccessModalOpen}
          message="리뷰가 성공적으로 수정되었습니다!"
          onClose={handleSuccessModalClose}
          showConfirmButton={false}
        />
      )}
    </>
  );
}
