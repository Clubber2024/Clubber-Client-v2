'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getNoticeListData } from './api/notice';
import { getFaqListData } from './api/faq';
import { Notice } from '@/types/community/noticeData';
import { FaqItem } from '@/types/community/faqData';
import ComingSoon from '@/components/common/ComingSoon';

interface CommunityTabProps {
  type: 'notices' | 'faq' | 'inquiries';
  onItemClick: (item: Notice) => void;
}

export default function CommunityTab({ type, onItemClick }: CommunityTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [faq, setFaq] = useState<FaqItem[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [totalPages] = useState(1);
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

  const fetchFaq = async () => {
    try {
      const response = await getFaqListData({ page: 1, size: 10 });
      setFaq(response.data);
    } catch (error) {
      console.error('Error fetching faq:', error);
    }
  };

  // 초기 데이터 로드
  useEffect(() => {
    if (type === 'notices') {
      fetchNotices(1);
    } else {
      fetchFaq();
    }
  }, [type]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (type === 'notices') {
      fetchNotices(page);
    } else {
      fetchFaq();
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
        {type == 'notices' && (
          <div>
            {notices.map((item) => (
              <div
                key={item.noticeId}
                className="flex justify-between items-center py-4 px-3 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onItemClick(item)}
              >
                <div className="flex-1">
                  <h3 className="text-gray-900 text-sm">{item.title}</h3>
                </div>
                <span className="text-gray-500 text-sm">{item.createdAt}</span>
              </div>
            ))}
          </div>
        )}
        {type == 'faq' && (
          <div>
            {faq.map((item) => (
              <div key={item.code} className="border-b border-gray-200">
                {/* 질문 */}
                <div
                  className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === item.code ? null : item.code)}
                >
                  <div className="flex items-center flex-1">
                    <div className="w-6 h-6 text-gray-900 text-lg font-extrabold flex items-center justify-center mr-3">
                      Q
                    </div>
                    <h3 className="text-gray-900 text-sm font-medium">{item.title}</h3>
                  </div>
                  <div className="text-gray-500">
                    {expandedFaq === item.code ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronUp className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* 답변 */}
                {expandedFaq === item.code && (
                  <div className="px-4 pb-4 bg-[#6666660D]">
                    <div className="flex flex-col">
                      <div className="w-6 h-6 text-primary text-lg font-extrabold flex items-center justify-center mr-3 my-2">
                        A
                      </div>
                      <div className="flex-1 text-gray-700 text-sm pl-1">{item.answer}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {type == 'inquiries' && <ComingSoon />}

        {/* 페이지네이션 */}
        {type == 'inquiries' || (
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
        )}
      </div>
    </div>
  );
}
