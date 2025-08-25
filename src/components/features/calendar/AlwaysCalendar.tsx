'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlwaysCalendar as AlwaysCalendarType } from '@/types/calendar/calendarData';
import CalendarModal from './CalendarModal';

interface AlwaysCalendarProps {
  alwaysCalendars: AlwaysCalendarType[];
  month: number;
}

export default function AlwaysCalendar({ alwaysCalendars, month }: AlwaysCalendarProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedCalendarNum, setSelectedCalendarNum] = useState<number>(0);

  const handleClubClick = async (calendar: AlwaysCalendarType) => {
    setIsCalendarModalOpen(true);
    setSelectedClubId(calendar.clubId);
    setSelectedCalendarNum(calendar.calendarNum);
  };

  return (
    <div className="h-full bg-white md:bg-primary md:p-4 rounded-xl md:rounded-xl md:my-10">
      <Card className="hidden md:block bg-white p-6 md:rounded-none h-full gap-2 md:gap-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1 md:mb-3">
          <h2 className="text-md md:text-xl font-bold text-gray-900 mr-0.5">상시모집</h2>
          <div className="flex-1 h-px bg-gray-900 ml-2"></div>
        </div>

        {/* 동아리 목록 */}
        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto scrollbar-hide md:overflow-x-visible">
          {alwaysCalendars.length > 0 ? (
            alwaysCalendars.map((calendar) => (
              <Button
                key={calendar.clubId}
                className="text-xs md:text-md w-fit h-7 pr-2 pl-2.5 py-0 md:py-0.5 justify-start rounded-sm transition-colors bg-[#A6D6F766] text-gray-800 hover:bg-primary/70 text-center"
                onClick={() => handleClubClick(calendar)}
              >
                <span>{calendar.clubName}</span>
                <span className="text-xs text-gray-500">
                  {calendar.calendarNum !== 0 && `+${calendar.calendarNum}`}
                </span>
              </Button>
            ))
          ) : (
            <div className="text-gray-500 text-sm">상시모집 동아리가 없습니다.</div>
          )}
        </div>
      </Card>
      <div
        className="block md:hidden w-full p-2.5 border-b-[0.5px] border-[#0000000a] pb-5"
        style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1)' }}
      >
        <h2 className="text-[17px] font-semibold text-gray-900 py-2 px-2">상시모집</h2>
        <div className="flex flex-row space-x-2 overflow-x-auto scrollbar-hide px-2">
          {alwaysCalendars.map((calendar) => (
            <Button
              key={calendar.clubId}
              className="text-xs w-fit h-6 px-4 py-0 justify-start rounded-full transition-colors bg-primary/30 text-gray-800 hover:bg-primary/70"
              onClick={() => handleClubClick(calendar)}
            >
              {calendar.clubName}
            </Button>
          ))}
        </div>
      </div>
      {isCalendarModalOpen && (
        <CalendarModal
          clubId={selectedClubId}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          isAlways={true}
          month={month}
          calendarNum={selectedCalendarNum}
        />
      )}
    </div>
  );
}
