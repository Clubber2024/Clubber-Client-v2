'use client';

import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { getDate, getMonth, getYear, startOfWeek, addDays } from 'date-fns';
import { Calendar } from 'lucide-react';
import Link from 'next/link';
import { getMainCalendar } from './api/main';
import { MainCalendarData } from '@/types/calendar/calendarData';

export default function MainCalendar() {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [calendarData, setCalendarData] = useState<MainCalendarData[] | null>(null);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  const fetchCalendarData = async () => {
    const data = await getMainCalendar();
    setCalendarData(data);
  };

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 일요일부터 시작

    // 현재 주의 7일 생성
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    setCurrentWeek(weekDates);
    fetchCalendarData();
  }, []);

  const today = new Date();
  const todayDate = getDate(today);
  const todayMonth = getMonth(today);
  const todayYear = getYear(today);

  return (
    <Card className="p-6 h-full gap-4 md:gap-6">
      <div className="flex flex-row items-center justify-between">
        <Link href="/calendar" className="hover:text-primary transition-colors duration-300">
          <h3 className="text-md md:text-lg font-bold">오늘, 모집 마감 🔥</h3>
        </Link>
        <Link
          href="/calendar"
          className="size-10 cursor-pointer hover:bg-gray-200 transition-colors duration-300 rounded-full border-none flex items-center justify-center"
        >
          <Calendar color="#52555B" className="size-5" />
        </Link>
      </div>
      {/* 캘린더 섹션 */}
      <div>
        {/* 요일 행 */}
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => {
            // currentWeek -> 오늘 날짜 인덱스
            const todayIndex = currentWeek.findIndex(
              (date) =>
                getDate(date) === todayDate &&
                getMonth(date) === todayMonth &&
                getYear(date) === todayYear
            );
            const isTodayDay = index === todayIndex;

            return (
              <div key={day} className="text-center">
                <div
                  className={`pt-1 size-8 mx-auto flex items-center justify-center text-sm font-medium rounded-t-full transition-colors ${
                    isTodayDay ? 'bg-primary text-white' : 'text-[#808080]'
                  }`}
                >
                  {day}
                </div>
              </div>
            );
          })}
        </div>

        {/* 날짜 행 */}
        <div className="grid grid-cols-7 gap-1">
          {currentWeek.map((date) => {
            const dateNumber = getDate(date);
            const isToday =
              dateNumber === todayDate &&
              getMonth(date) === todayMonth &&
              getYear(date) === todayYear;

            return (
              <div key={date.getTime()} className="text-center">
                <div
                  className={`pb-1 size-8 mx-auto flex items-center justify-center text-sm font-medium rounded-b-full transition-colors ${
                    isToday ? 'bg-primary text-white' : 'text-gray-700'
                  }`}
                >
                  {dateNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 구분선 */}
      <div className="border-t border-gray-300 m-0 pb-1 md:pb-0"></div>
      {/* 이벤트 리스트 */}
      <div className="space-y-1">
        {calendarData && calendarData.length > 0 ? (
          <div className="flex flex-col items-start gap-2">
            {calendarData.map((item: MainCalendarData) => (
              <div key={item.clubId} className="flex flex-row items-center gap-2 pl-2">
                <div className="size-1.5 bg-gray-800 rounded-full"></div>
                <Link
                  href={`/clubInfo?clubId=${item.clubId}`}
                  className="text-sm text-gray-900 hover:text-primary transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {item.clubName}
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-500">오늘 모집마감인 동아리가 없습니다.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
