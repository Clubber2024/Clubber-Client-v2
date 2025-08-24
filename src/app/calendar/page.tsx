'use client';

import { useEffect, useState } from 'react';
import Calendar from '@/components/features/calendar/Calendar';
import AlwaysCalendar from '@/components/features/calendar/AlwaysCalendar';
import { getCalendarData } from '@/components/features/calendar/api/calendar';
import { CalendarData } from '@/types/calendar/calendarData';
import Loading from '@/components/common/Loading';

export default function CalendarPage() {
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const fetchCalendarData = async (year: number, month: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCalendarData(year, month);
      console.log('Calendar data :', data);
      setCalendarData(data);
    } catch (err) {
      setError('캘린더 데이터를 불러오는데 실패했습니다.');
      console.error('Calendar data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData(currentMonth.year, currentMonth.month);
  }, [currentMonth.year, currentMonth.month]);

  const handleMonthChange = (year: number, month: number) => {
    setCurrentMonth({ year, month });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex md:flex-row flex-col md:gap-4 md:max-w-6xl mx-auto">
      <div className="flex-1 flex flex-col">
        <AlwaysCalendar
          alwaysCalendars={calendarData?.alwaysCalendars || []}
          month={currentMonth.month}
        />
      </div>
      <div className="flex-3 flex flex-col">
        <Calendar
          calendarData={calendarData}
          nonAlwaysCalendars={calendarData?.nonAlwaysCalendars || []}
          currentMonth={currentMonth}
          onMonthChange={handleMonthChange}
        />
      </div>
    </div>
  );
}
