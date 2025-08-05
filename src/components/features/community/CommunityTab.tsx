'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getNoticeListData } from './api/notice';
import { Notice } from '@/types/community/noticeData';

interface CommunityItem {
  id: number;
  title: string;
  date: string;
  content?: string;
}

interface CommunityTabProps {
  type: 'notices' | 'faq' | 'inquiries';
}

export default function CommunityTab({ type }: CommunityTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<CommunityItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const itemsPerPage = 10;
  const sort = 'desc';

  const fetchNotices = async (page: number) => {
    try {
      const response = await getNoticeListData({ page, size: itemsPerPage, sort: sort });
      setNotices(response.data.content);
      console.log(notices);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  // Mock 데이터 (FAQ, 문의사항용)
  const mockItems = {
    faq: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      title: `자주 묻는 질문 ${i + 1}`,
      date: '2025.07.10',
      content: '자주 묻는 질문에 대한 답변입니다...',
    })),
    inquiries: Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      title: `문의사항 ${i + 1}`,
      date: '2025.07.10',
      content: '문의사항에 대한 답변입니다...',
    })),
  };

  // Mock 데이터 처리
  const processMockData = (page: number) => {
    if (type === 'notices') return;
    if (!mockItems || !mockItems[type as 'faq' | 'inquiries']) return;

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = mockItems[type as 'faq' | 'inquiries'].slice(startIndex, endIndex);

    setItems(currentItems);
    setTotalPages(Math.ceil(mockItems[type as 'faq' | 'inquiries'].length / itemsPerPage));
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (type === 'notices') {
      fetchNotices(1);
    } else {
      processMockData(1);
    }
  }, [type]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (type === 'notices') {
      fetchNotices(page);
    } else {
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
        {type === 'notices' ? (
          <div>
            {notices.map((item) => (
              <div
                key={item.noticeId}
                className="flex justify-between items-center py-4 px-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => console.log(item)}
              >
                <div className="flex-1">
                  <h3 className="text-gray-900 text-sm">{item.title}</h3>
                </div>
                <span className="text-gray-500 text-sm">{item.createdAt}</span>
              </div>
            ))}
          </div>
        ) : (
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
        )}

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
