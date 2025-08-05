'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface CommunityItem {
  id: number;
  title: string;
  date: string;
  content?: string;
}

interface CommunityDetailProps {
  item: CommunityItem;
  onBack: () => void;
}

export default function CommunityDetail({ item, onBack }: CommunityDetailProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        {/* 뒤로가기 버튼 */}
        <div className="mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            목록으로 돌아가기
          </Button>
        </div>

        {/* 제목 */}
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
          <p className="text-gray-500 text-sm">{item.date}</p>
        </div>

        {/* 내용 */}
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{item.content || '내용이 없습니다.'}</p>
        </div>
      </Card>
    </div>
  );
}
