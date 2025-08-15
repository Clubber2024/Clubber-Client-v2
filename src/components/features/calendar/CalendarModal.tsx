import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { getCalendarClubData } from './api/calendar';
import { useEffect, useState } from 'react';
import { CalendarClubData } from '@/types/calendar/calendarData';

interface CalendarModalProps {
  clubId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendarModal({ clubId, isOpen, onClose }: CalendarModalProps) {
  const [clubData, setClubData] = useState<CalendarClubData | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchClubData = async () => {
      if (!clubId) return;
      const data = await getCalendarClubData(clubId);
      setClubData(data.data);
    };
    fetchClubData();
  }, [clubId]);

  // 모집기간 포맷팅 함수
  const getRecruitmentPeriod = () => {
    if (!clubData) return '';
    if (clubData.startAt && clubData.endAt) {
      return `${clubData.startAt} ~ ${clubData.endAt}`;
    } else if (clubData.startAt) {
      return `${clubData.startAt} ~`;
    } else if (clubData.endAt) {
      return `~ ${clubData.endAt}`;
    } else {
      return clubData.recruitStatus;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 p-6 relative">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-center flex-1">{clubData?.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="space-y-4">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">제목</label>
            <p className="text-sm text-gray-900">{clubData?.title}</p>
          </div>

          {/* 모집유형 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">모집유형</label>
            <p className="text-sm text-gray-900">{clubData?.recruitType}</p>
          </div>

          {/* 모집기간 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">모집기간</label>
            <p className="text-sm text-gray-900">{getRecruitmentPeriod()}</p>
          </div>

          {/* 관련링크 */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">관련링크</label>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
              onClick={() => window.open(clubData?.url, '_blank')}
            >
              바로가기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
