'use client';

import { useEffect, useState } from 'react';
import Calendar from '@/components/features/calendar/Calendar';
import AlwaysCalendar from '@/components/features/calendar/AlwaysCalendar';
import { getCalendarData } from '@/components/features/calendar/api/calendar';
import { CalendarResponse } from '@/types/calendar/calendarData';

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;

        const data = await getCalendarData(year, month);
        setCalendarData(data);
      } catch (err) {
        setError('캘린더 데이터를 불러오는데 실패했습니다.');
        console.error('Calendar data fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-4 items-stretch">
      <div className="flex-1">
        <AlwaysCalendar alwaysCalendars={calendarData?.alwaysCalendars || []} />
      </div>
      <div className="flex-3">
        <Calendar
          calendarData={calendarData}
          nonAlwaysCalendars={calendarData?.nonAlwaysCalendars || []}
        />
      </div>
    </div>
  );
}
