import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { getCalendarClubData } from './api/calendar';
import { useEffect, useState } from 'react';
import { AlwaysNextClubData, CalendarClubData } from '@/types/calendar/calendarData';
import { getAlwaysClubData } from './api/calendar';

interface CalendarModalProps {
  clubId: number | null;
  isOpen: boolean;
  onClose: () => void;
  isAlways: boolean;
  month: number;
}

export default function CalendarModal({
  clubId,
  isOpen,
  onClose,
  isAlways,
  month,
}: CalendarModalProps) {
  const [clubData, setClubData] = useState<CalendarClubData | null>(null);
  const [alwaysClubData, setAlwaysClubData] = useState<AlwaysNextClubData | null>(null);
  const [allAlwaysData, setAllAlwaysData] = useState<AlwaysNextClubData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (!isOpen || !clubId) return;

    const fetchClubData = async () => {
      if (isAlways) {
        const response = await getAlwaysClubData(month, clubId!, null); // 초기 로드 시에는 nowCalendarId를 null로 전달
        setAllAlwaysData(response.data.content);
        setAlwaysClubData(response.data.content[0]);
        setHasNext(response.data.hasNext);
        setSize(response.data.size + 1); // size + 1 = 실제 항목 개수 (size: 1이면 실제로는 2개)
      } else {
        const response = await getCalendarClubData(clubId!);
        setClubData(response.data);
      }
    };
    fetchClubData();
  }, [clubId, isOpen, isAlways, month]);

  // 모집기간 포맷팅 함수
  const getRecruitmentPeriod = () => {
    if (isAlways) {
      return alwaysClubData?.recruitStatus;
    } else {
      if (clubData?.startAt && clubData?.endAt) {
        return `${clubData.startAt} ~ ${clubData.endAt}`;
      } else if (clubData?.startAt) {
        return `${clubData.startAt} ~`;
      } else if (clubData?.endAt) {
        return `~ ${clubData.endAt}`;
      } else {
        return '';
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setAlwaysClubData(allAlwaysData[newIndex]);
    }
  };

  const handleNext = async (clubId: number) => {
    if (currentIndex < size - 1 && isAlways && alwaysClubData) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);

      // 다음 항목이 이미 로드된 데이터에 있는지 확인
      if (allAlwaysData[newIndex]) {
        setAlwaysClubData(allAlwaysData[newIndex]);
      } else {
        // 새로운 API 호출이 필요한 경우
        const response = await getAlwaysClubData(month, clubId, alwaysClubData.id);
        const newData = response.data.content[0];
        setAllAlwaysData((prev) => [...prev, newData]);
        setAlwaysClubData(newData);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-96 md:w-120 px-10 py-9 relative mx-4 md:mx-0">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-center flex-1">
            {isAlways ? alwaysClubData?.title : clubData?.title}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* 네비게이션 화살표 */}
        {hasNext && size > 1 && (
          <>
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 transition-all duration-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleNext(clubId!)}
              disabled={currentIndex === size - 1}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full p-1 transition-all duration-300 disabled:text-gray-300 disabled:cursor-not-allowed disabled:hover:bg-transparent"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        {/* 내용 */}
        <div className="space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-[15px] font-semibold mb-1">제목</label>
            <p className="text-sm text-gray-800">
              {isAlways ? alwaysClubData?.title : clubData?.title}
            </p>
          </div>

          {/* 모집유형 */}
          <div>
            <label className="block text-[15px] font-semibold mb-1">모집유형</label>
            <p className="text-sm text-gray-800">
              {isAlways
                ? alwaysClubData?.recruitType === 'ADDITIONAL'
                  ? '추가모집'
                  : alwaysClubData?.recruitType === 'REGULAR'
                    ? '정규모집'
                    : alwaysClubData?.recruitType === 'ALWAYS'
                      ? '상시모집'
                      : alwaysClubData?.recruitType
                : clubData?.recruitType === 'ADDITIONAL'
                  ? '추가모집'
                  : clubData?.recruitType === 'REGULAR'
                    ? '정규모집'
                    : clubData?.recruitType === 'ALWAYS'
                      ? '상시모집'
                      : clubData?.recruitType}
            </p>
          </div>

          {/* 모집기간 */}
          <div>
            <label className="block text-[15px] font-semibold mb-1">모집기간</label>
            <p className="text-sm text-gray-800">{getRecruitmentPeriod()}</p>
          </div>

          {/* 관련링크 */}
          <div>
            <label className="block text-[15px] font-semibold mb-1.5">관련링크</label>
            <Button
              className="w-24 bg-primary hover:bg-primary/90 text-white rounded-sm"
              onClick={() => window.open(isAlways ? alwaysClubData?.url : clubData?.url, '_blank')}
            >
              바로가기
            </Button>
          </div>
        </div>
        {/* 인디케이터 */}
        {hasNext && size > 1 && (
          <div className="flex justify-center space-x-2 mt-6">
            {Array.from({ length: size }, (_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
