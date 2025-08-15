'use client';

import { useState } from 'react';
import { getMonth, getDate, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { CalendarData, NonAlwaysCalendar } from '@/types/calendar/calendarData';
import CalendarModal from './CalendarModal';

interface CalendarProps {
  calendarData: CalendarData | null;
  nonAlwaysCalendars: NonAlwaysCalendar[];
}

export default function Calendar({ calendarData, nonAlwaysCalendars }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedClubId, setSelectedClubId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

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

  const onClubClick = (clubId: number) => {
    setIsCalendarModalOpen(true);
    setSelectedClubId(clubId);
  };

  const onDateClick = (date: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const clickedDate = new Date(year, month - 1, date);
      setSelectedDate(clickedDate);
      setIsDateModalOpen(true);
    }
  };

  // 선택된 날짜의 이벤트 분류
  const getEventsForDate = (date: number, month: number) => {
    const startEvents = nonAlwaysCalendars.filter((item) => {
      const itemDate = new Date(item.startAt);
      return getDate(itemDate) === date && getMonth(itemDate) + 1 === month;
    });

    const endEvents = nonAlwaysCalendars.filter((item) => {
      const itemDate = new Date(item.endAt);
      return getDate(itemDate) === date && getMonth(itemDate) + 1 === month;
    });

    return { startEvents, endEvents };
  };

  return (
    <div className="flex justify-center items-center bg-primary md:my-10 mt-2 rounded-lg">
      <div className="w-full">
        {/* 헤더 */}
        <div className="flex flex-row justify-between items-center w-full px-5">
          <div className="flex flex-row items-center">
            <h1 className="text-white py-6 pl-2 text-4xl md:text-6xl font-bold">
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
        <div className="grid grid-cols-7 gap-1 md:gap-2 p-2 md:p-4">
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

            const { startEvents, endEvents } = isCurrentMonth
              ? getEventsForDate(date, month)
              : { startEvents: [], endEvents: [] };
            const hasEvents = startEvents.length > 0 || endEvents.length > 0;

            return (
              <Card
                key={i}
                className={`flex flex-col p-1.5 md:p-2 h-[100px] rounded-md gap-0 cursor-pointer transition-all hover:shadow-md ${
                  isCurrentMonth ? 'bg-white' : 'bg-white/50'
                } ${isToday ? 'ring-2 ring-primary' : ''} ${hasEvents ? 'hover:scale-105' : ''}`}
                onClick={() => onDateClick(date, isCurrentMonth)}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-base ${isCurrentMonth ? 'text-gray-900' : 'text-gray-500'} ${
                      isToday
                        ? 'w-7 h-7 rounded-full bg-primary text-white text-center leading-7'
                        : ''
                    }`}
                  >
                    {displayDate}
                  </span>

                  {/* PC에서는 상세 정보 표시, 모바일에서는 개수만 표시 */}
                  <div className="hidden md:flex flex-col gap-1 overflow-y-auto flex-1">
                    {nonAlwaysCalendars.map((item, index) => {
                      const isStartDate =
                        currentMonthDate === getDate(new Date(item.startAt)) &&
                        month === getMonth(new Date(item.startAt)) + 1;

                      const isEndDate =
                        currentMonthDate === getDate(new Date(item.endAt)) &&
                        month === getMonth(new Date(item.endAt)) + 1;

                      if (!isStartDate && !isEndDate) return null;

                      const isStart = isStartDate;
                      const textColor = isStart ? 'text-blue-500' : 'text-red-500';

                      return (
                        <div
                          key={`${item.clubId}-${index}-${isStart ? 'start' : 'end'}`}
                          className="flex items-center text-sm"
                        >
                          <div
                            onClick={() => onClubClick(item.clubId)}
                            className="hover:scale-105 transition-all duration-300 hover:text-primary cursor-pointer"
                          >
                            <span className={`font-semibold ${textColor}`}>
                              {isStart ? '시작' : '마감'}
                            </span>
                            <span className="ml-1">{item.clubName}</span>
                          </div>
                          <Star className="size-2 ml-1" strokeWidth={1.5} color="#FFD000" />
                        </div>
                      );
                    })}
                  </div>

                  {/* 모바일에서만 이벤트 개수 표시 */}
                  <div className="md:hidden flex flex-col gap-1 mt-auto justify-center">
                    {startEvents.length > 0 && (
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                          {startEvents.length}개
                        </span>
                      </div>
                    )}
                    {endEvents.length > 0 && (
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          {endEvents.length}개
                        </span>
                      </div>
                    )}
                    {/* 이벤트가 없는 경우 빈 공간 유지 */}
                    {startEvents.length === 0 && endEvents.length === 0 && (
                      <div className="h-6"></div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 날짜 상세 모달 (모바일 전용) */}
      {isDateModalOpen && selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 md:hidden">
          <div
            className={`w-full bg-white rounded-t-3xl p-6 transform transition-all duration-400 ease-out ${
              isDateModalOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
          >
            {/* 모달 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedDate.getDate()}. {weekDays[selectedDate.getDay()]}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {year}년 {month}월
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDateModalOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-95"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            {/* 이벤트 목록 */}
            <div className="space-y-4">
              {(() => {
                const { startEvents, endEvents } = getEventsForDate(selectedDate.getDate(), month);

                return (
                  <>
                    {/* 시작 이벤트 */}
                    {startEvents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          시작하는 동아리 ({startEvents.length}개)
                        </h4>
                        <div className="space-y-2">
                          {startEvents.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-105 hover:shadow-md transform hover:-translate-y-1"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.clubName}</div>
                                <div className="text-xs text-blue-600 mt-1">
                                  {new Date(item.startAt).toLocaleDateString()} ~{' '}
                                  {new Date(item.endAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  onClubClick(item.clubId);
                                  setIsDateModalOpen(false);
                                }}
                                className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 hover:scale-110 active:scale-95"
                              >
                                상세보기
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 마감 이벤트 */}
                    {endEvents.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          마감하는 동아리 ({endEvents.length}개)
                        </h4>
                        <div className="space-y-2">
                          {endEvents.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-105 hover:shadow-md transform hover:-translate-y-1"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{item.clubName}</div>
                                <div className="text-xs text-red-600 mt-1">
                                  {new Date(item.endAt).toLocaleDateString()} ~{' '}
                                  {new Date(item.endAt).toLocaleDateString()}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => {
                                  onClubClick(item.clubId);
                                  setIsDateModalOpen(false);
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110 active:scale-95"
                              >
                                상세보기
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 이벤트가 없는 경우 */}
                    {startEvents.length === 0 && endEvents.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>시작 또는 마감 이벤트가 없습니다</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

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

      {isCalendarModalOpen && (
        <CalendarModal
          clubId={selectedClubId}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
        />
      )}
    </div>
  );
}
