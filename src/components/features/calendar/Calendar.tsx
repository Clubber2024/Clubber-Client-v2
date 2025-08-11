'use client';

import { useState } from 'react';
import { getMonth, getDate, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { CalendarData, NonAlwaysCalendar } from '@/types/calendar/calendarData';

interface CalendarProps {
  calendarData: CalendarData | null;
  nonAlwaysCalendars: NonAlwaysCalendar[];
}

export default function Calendar({ calendarData, nonAlwaysCalendars }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const today = new Date();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  // 현재 달의 첫 날의 요일
  const curMonthFirstDay = getDay(new Date(year, month - 1, 1));
  // 현재 달의 마지막 날 날짜
  const curMonthLastDate = getDate(new Date(year, month, 0));
  // 이전 달의 마지막 날 날짜
  const lastMonthLastDate = getDate(new Date(year, month - 1, 0));

  const totalCells = curMonthFirstDay + curMonthLastDate > 35 ? 42 : 35;

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);

    // 연도 경계 체크 (2025년만 허용)
    if (newDate.getFullYear() !== 2025) {
      setModalMessage('2025년만 조회 가능합니다.');
      setIsModalOpen(true);
      return;
    }

    setCurrentDate(newDate);
  };

  if (!calendarData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center bg-primary my-12 rounded-lg">
      <div className="w-full">
        {/* 헤더 */}
        <div className="flex flex-row justify-between items-center w-full px-5">
          <div className="flex flex-row items-center">
            <h1 className="text-white py-6 pl-2 text-6xl font-bold">
              {year}.{String(month).padStart(2, '0')}
            </h1>
            <div className="flex items-center ml-8 text-white">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 py-4"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="size-8 stroke-[2.5]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white font-extrabold hover:bg-white/20 p-2"
                onClick={() => changeMonth(+1)}
              >
                <ChevronRight className="size-8 stroke-[2.5]" />
              </Button>
            </div>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-4 gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className={`text-white font-bold p-2 text-center ${
                day === '일' ? 'text-red-500' : ''
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-2 p-4">
          {Array.from({ length: totalCells }, (_, i) => {
            const date = i - curMonthFirstDay + 1;
            const currentMonthDate = date;
            const isCurrentMonth = currentMonthDate > 0 && currentMonthDate <= curMonthLastDate;

            const displayDate = isCurrentMonth
              ? date
              : date <= 0
                ? lastMonthLastDate + date
                : date - curMonthLastDate;

            const isToday =
              isCurrentMonth &&
              date === today.getDate() &&
              month === today.getMonth() + 1 &&
              year === today.getFullYear();

            return (
              <Card
                key={i}
                className={`flex flex-col p-2 min-h-[120px] rounded-md gap-0 ${
                  isCurrentMonth ? 'bg-white' : 'bg-white/50'
                } ${isToday ? 'ring-2 ring-primary' : ''}`}
              >
                <span
                  className={`text-base ${isCurrentMonth ? 'text-gray-900' : 'text-gray-500'} ${
                    isToday
                      ? 'w-7 h-7 rounded-full bg-primary text-white text-center leading-7'
                      : ''
                  }`}
                >
                  {displayDate}
                </span>

                <div className="flex flex-col gap-1 overflow-y-auto">
                  {nonAlwaysCalendars.map((item, index) => {
                    // 시작일
                    const isStartDate =
                      currentMonthDate === getDate(new Date(item.startAt)) &&
                      month === getMonth(new Date(item.startAt)) + 1;

                    // 마감일
                    const isEndDate =
                      currentMonthDate === getDate(new Date(item.endAt)) &&
                      month === getMonth(new Date(item.endAt)) + 1;

                    if (!isStartDate && !isEndDate) return null;

                    const isStart = isStartDate;
                    const textColor = isStart ? 'text-blue-500' : 'text-red-500';

                    return (
                      <div
                        key={`${item.clubId}-${index}-${isStart ? 'start' : 'end'}`}
                        className={`flex items-center text-sm`}
                      >
                        <div>
                          <span className={`font-semibold ${textColor}`}>
                            {isStart ? '시작' : '마감'}
                          </span>
                          <span className="ml-1">{item.clubName}</span>
                        </div>
                        <Star className="size-3 ml-1" strokeWidth={1.5} color="#FFD000" />
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 모달들 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>{modalMessage}</p>
            <Button onClick={() => setIsModalOpen(false)} className="mt-4">
              확인
            </Button>
          </div>
        </div>
      )}

      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <p>{modalMessage}</p>
            <Button onClick={() => setIsLoginModalOpen(false)} className="mt-4">
              확인
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
