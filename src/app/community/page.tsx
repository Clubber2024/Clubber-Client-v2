'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CommunityTab from '@/components/features/community/CommunityTab';
import CommunityDetail from '@/components/features/community/CommunityDetail';
import { Notice } from '@/types/community/noticeData';

type TabType = 'notices' | 'faq' | 'inquiries';

function CommunityContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('notices');
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // URL 쿼리 파라미터에서 탭
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['notices', 'faq', 'inquiries'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const noticeIdParam = searchParams.get('noticeId');
    if (noticeIdParam) {
      setSelectedItemId(Number(noticeIdParam));
    }
  }, [searchParams]);

  const tabs = [
    { id: 'notices' as TabType, label: '공지사항' },
    { id: 'faq' as TabType, label: '자주 묻는 질문' },
    { id: 'inquiries' as TabType, label: '문의사항' },
  ];

  const handleItemClick = (item: Notice) => {
    setSelectedItemId(item.noticeId);
  };

  const handleBack = () => {
    setSelectedItemId(null);
  };

  const handleItemChange = (newItemId: number) => {
    setSelectedItemId(newItemId);
  };

  if (selectedItemId) {
    return (
      <CommunityDetail
        itemId={selectedItemId}
        type={activeTab}
        onBack={handleBack}
        onItemChange={handleItemChange}
      />
    );
  }

  return (
    <div className="min-h-screen md:max-w-6xl md:mx-auto mx-4 py-8">
      <div className="max-w-6xl md:max-w-5xl mx-auto px-5 md:px-10">
        {/* 페이지 제목 */}
        <h1 className="text-2xl font-bold text-center text-gray-900 my-8">커뮤니티</h1>

        {/* 탭 네비게이션 */}
        <div className="flex">
          <div className="flex border-b border-gray-200 w-full mx-auto space-x-4">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`px-2 py-5 rounded-none border-b-2 font-semibold text-lg transition-colors hover:text-primary hover:border-primary ${
                  activeTab === tab.id
                    ? 'border-primary text-gray-900 bg-transparent'
                    : 'border-transparent text-gray-500'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <CommunityTab type={activeTab} onItemClick={handleItemClick} />
      </div>
    </div>
  );
}

export default function Community() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen py-8 flex items-center justify-center">로딩 중...</div>
      }
    >
      <CommunityContent />
    </Suspense>
  );
}
