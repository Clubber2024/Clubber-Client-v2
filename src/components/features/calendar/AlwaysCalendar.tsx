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

  const handleClubClick = async (calendar: AlwaysCalendarType) => {
    setIsCalendarModalOpen(true);
    setSelectedClubId(calendar.clubId);
  };

  return (
    <div className="h-full bg-primary p-2 md:p-4 rounded-xl md:rounded-xl md:my-10">
      <Card className="bg-white p-6 md:rounded-none h-full gap-2 md:gap-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-md md:text-xl font-bold text-gray-900 mr-0.5">상시모집</h2>
          <div className="flex-1 h-px bg-gray-900 ml-2"></div>
        </div>

        {/* 동아리 목록 */}
        <div className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-x-visible">
          {alwaysCalendars.length > 0 ? (
            alwaysCalendars.map((calendar) => (
              <Button
                key={calendar.clubId}
                className="text-xs md:text-md w-fit px-2 py-0 md:py-0.5 justify-start rounded-md transition-colors bg-secondary text-gray-800 hover:bg-primary/70"
                onClick={() => handleClubClick(calendar)}
              >
                {calendar.clubName}
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
      {isCalendarModalOpen && (
        <CalendarModal
          clubId={selectedClubId}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          isAlways={true}
          month={month}
        />
      )}
    </div>
  );
}
