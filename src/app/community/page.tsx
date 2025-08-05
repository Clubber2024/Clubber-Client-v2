'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CommunityTab from '@/components/features/community/CommunityTab';
import CommunityDetail from '@/components/features/community/CommunityDetail';

interface CommunityItem {
  id: number;
  title: string;
  date: string;
}

type TabType = 'notices' | 'faq' | 'inquiries';

export default function Community() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('notices');
  const [selectedItem, setSelectedItem] = useState<CommunityItem | null>(null);

  // URL 쿼리 파라미터에서 탭 확인
  useEffect(() => {
    const tabParam = searchParams.get('tab') as TabType;
    if (tabParam && ['notices', 'faq', 'inquiries'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Mock 데이터 (FAQ, 문의사항용)
  const mockData = {
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

  const tabs = [
    { id: 'notices' as TabType, label: '공지사항' },
    { id: 'faq' as TabType, label: '자주 묻는 질문' },
    { id: 'inquiries' as TabType, label: '문의사항' },
  ];

  const handleBack = () => {
    setSelectedItem(null);
  };

  if (selectedItem) {
    return <CommunityDetail item={selectedItem} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-10">
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
        <CommunityTab
          type={activeTab}
          items={activeTab !== 'notices' ? mockData[activeTab] : undefined}
        />
      </div>
    </div>
  );
}
