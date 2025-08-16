'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { getNoticeDetailData } from './api/notice';
import { Notice } from '@/types/community/noticeData';
import Divider from '@/components/ui/divider';
import Loading from '@/components/common/Loading';

interface CommunityItem {
  id: number;
  title: string;
  date: string;
  content?: string;
}

interface CommunityDetailProps {
  itemId: number;
  type: 'notices' | 'faq' | 'inquiries';
  onBack: () => void;
  onItemChange?: (newItemId: number) => void;
}

export default function CommunityDetail({
  itemId,
  type,
  onBack,
  onItemChange,
}: CommunityDetailProps) {
  const [item, setItem] = useState<CommunityItem | Notice | null>(null);
  const [prevItem, setPrevItem] = useState<CommunityItem | Notice | null>(null);
  const [nextItem, setNextItem] = useState<CommunityItem | Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (type === 'notices') {
          // 공지사항 API 호출
          const detailData = await getNoticeDetailData(itemId);
          setItem({
            id: detailData.noticeId,
            title: detailData.title,
            date: detailData.createdAt,
            content: detailData.content,
          });

          // 이전 글 데이터 가져오기
          try {
            const prevData = await getNoticeDetailData(itemId - 1);
            setPrevItem({
              id: prevData.noticeId,
              title: prevData.title,
              date: prevData.createdAt,
              content: prevData.content,
            });
          } catch (error) {
            console.log(error);
            setPrevItem(null);
          }

          // 다음 글 데이터 가져오기
          try {
            const nextData = await getNoticeDetailData(itemId + 1);
            setNextItem({
              id: nextData.noticeId,
              title: nextData.title,
              date: nextData.createdAt,
              content: nextData.content,
            });
          } catch (error) {
            console.log(error);
            setNextItem(null);
          }
        } else {
          // 문의사항
        }
      } catch (error) {
        console.error('Error fetching detail :', error);
        setError('상세 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [itemId, type]);

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-white">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen py-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">해당 항목을 찾을 수 없습니다.</p>
          <Button onClick={onBack} className="bg-primary hover:bg-primary/90 text-white">
            목록으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="md:max-w-4xl mx-auto md:px-4">
        <div className="p-4 md:p-8">
          {/* 제목 */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {type === 'notices' ? '공지사항' : type === 'faq' ? '자주 묻는 질문' : '문의사항'}
            </h1>
          </div>

          {/* 상세 내용 */}
          <div className="w-full border-t border-gray-900">
            {/* 제목 */}
            <div className="my-5 px-5">
              <h2 className="text-md font-semibold text-gray-900 mb-2">{item.title}</h2>
              <p className="text-gray-500 text-sm">{'date' in item ? item.date : item.createdAt}</p>
            </div>

            <Divider />
            {/* 내용 */}
            <div className="prose max-w-none px-5 py-6">
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                {item.content || '내용이 없습니다.'}
              </div>
            </div>
            <Divider />
          </div>

          {/* 이전/다음 네비게이션 */}
          <div>
            {/* 이전 글 */}
            {prevItem ? (
              <div
                onClick={() => onItemChange?.(itemId - 1)}
                className="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-row justify-between items-center gap-3 flex-1 text-sm">
                  <div className="flex flex-row">
                    <div className="font-semibold mb-1 mr-4 text-gray-800">이전</div>
                    <div className="truncate">{prevItem.title}</div>
                  </div>
                  <div className=" text-gray-400">
                    {'date' in prevItem ? prevItem.date : prevItem.createdAt}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex p-4 border-b border-gray-200 text-sm">
                <div className="flex flex-row gap-3 flex-1">
                  <div className=" text-gray-500 mb-1 mr-4">이전</div>
                  <div className=" text-gray-400">이전 글이 없습니다.</div>
                </div>
              </div>
            )}

            {/* 다음 글 */}
            {nextItem ? (
              <div
                onClick={() => onItemChange?.(itemId + 1)}
                className="flex items-center p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-row justify-between items-center gap-3 flex-1 text-sm">
                  <div className="flex flex-row">
                    <div className="font-semibold mb-1 mr-4 text-gray-800">다음</div>
                    <div className="truncate">{nextItem.title}</div>
                  </div>
                  <div className=" text-gray-400">
                    {'date' in nextItem ? nextItem.date : nextItem.createdAt}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center p-4 border-b border-gray-200 text-sm">
                <div className="flex flex-row gap-3 flex-1">
                  <div className=" text-gray-500 mb-1 mr-4">다음</div>
                  <div className=" text-gray-400">다음 글이 없습니다.</div>
                </div>
              </div>
            )}
          </div>

          {/* 목록 버튼 */}
          <div className="text-center my-14">
            <Button
              onClick={onBack}
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-6 py-2 rounded-sm"
            >
              목록
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
