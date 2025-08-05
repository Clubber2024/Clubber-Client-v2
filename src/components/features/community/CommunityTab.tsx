'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNoticeListData } from './api/notice';

interface CommunityItem {
  id: number;
  title: string;
  date: string;
  content?: string;
}

interface CommunityTabProps {
  type: 'notices' | 'faq' | 'inquiries';
  items?: CommunityItem[]; // Mock 데이터용
}

export default function CommunityTab({ type, items: mockItems }: CommunityTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  // 공지사항 API 호출
  const fetchNotices = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getNoticeListData({
        page: page, // API는 0-based, UI는 1-based
        size: itemsPerPage,
      });

      const noticeItems = response.content.map((notice) => ({
        id: notice.noticeId,
        title: notice.title,
        date: notice.createdAt,
        content: notice.content,
      }));

      setItems(noticeItems);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError('데이터를 불러오는데 실패했습니다.');
      console.error('데이터 불러오기 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock 데이터 처리
  const processMockData = (page: number) => {
    if (!mockItems) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = mockItems.slice(startIndex, endIndex);

    setItems(currentItems);
    setTotalPages(Math.ceil(mockItems.length / itemsPerPage));
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (type === 'notices') {
      fetchNotices(1);
    } else if (mockItems) {
      processMockData(1);
    }
  }, [type, mockItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (type === 'notices') {
      fetchNotices(page);
    } else if (mockItems) {
      processMockData(page);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto">
      <div>
        {/* 목록 */}
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 px-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => console.log(item)}
            >
              <div className="flex-1">
                <h3 className="text-gray-900 text-sm">{item.title}</h3>
              </div>
              <span className="text-gray-500 text-sm">{item.date}</span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-10 h-10 rounded-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePageChange(page)}
              className="w-9 h-10 rounded-sm"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="w-10 h-10 rounded-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
