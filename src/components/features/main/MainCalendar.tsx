'use client';

import { Card } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { getDate, getMonth, getYear, startOfWeek, addDays } from 'date-fns';

export default function MainCalendar() {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  useEffect(() => {
    const today = new Date();
    const weekStart = startOfWeek(today, { weekStartsOn: 0 }); // 일요일부터 시작

    // 현재 주의 7일 생성
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    setCurrentWeek(weekDates);
  }, []);

  const today = new Date();
  const todayDate = getDate(today);

  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold">오늘, 모집 마감 🔥</h3>

      {/* 캘린더 섹션 */}
      <div>
        {/* 요일 행 */}
        <div className="grid grid-cols-7 gap-1">
          {daysOfWeek.map((day, index) => {
            const isTodayDay = index === today.getDay();
            return (
              <div key={day} className="text-center">
                <div
                  className={`pt-1 w-8 h-8 mx-auto flex items-center justify-center text-sm font-medium rounded-t-full transition-colors ${
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
              getMonth(date) === getMonth(today) &&
              getYear(date) === getYear(today);

            return (
              <div key={date.getTime()} className="text-center">
                <div
                  className={`pb-1 w-8 h-8 mx-auto flex items-center justify-center text-sm font-medium rounded-b-full transition-colors ${
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
      <div className="border-t border-gray-200 m-0"></div>

      {/* 이벤트 리스트 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">클러버</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">프로그래밍 동아리</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          <span className="text-sm text-gray-700">댄스 동아리</span>
        </div>
      </div>
    </Card>
  );
}
