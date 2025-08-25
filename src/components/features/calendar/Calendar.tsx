'use client';

import { useState, useEffect } from 'react';
import { getMonth, getDate, getDay } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Calendar as CalendarIcon, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalendarData, NonAlwaysCalendar } from '@/types/calendar/calendarData';
import CalendarModal from './CalendarModal';
import Loading from '@/components/common/Loading';
import { useLoginStore } from '@/stores/login/useLoginStore';
import Modal from '@/components/common/Modal';
import { useRouter } from 'next/navigation';
import { addFavorite, deleteFavorite, getFavoriteStatus } from '../bookmark/api/bookmark';

interface CalendarProps {
  calendarData: CalendarData | null;
  nonAlwaysCalendars: NonAlwaysCalendar[];
  currentMonth: { year: number; month: number };
  onMonthChange: (year: number, month: number) => void;
}

export default function Calendar({
  calendarData,
  nonAlwaysCalendars,
  currentMonth,
  onMonthChange,
}: CalendarProps) {
  const router = useRouter();
  const { isLoggedIn } = useLoginStore();
  const [favoriteStatuses, setFavoriteStatuses] = useState<{
    [key: number]: { isFavorite: boolean; favoriteId?: number };
  }>({});

  const [currentDate, setCurrentDate] = useState(() => {
    return new Date(currentMonth.year, currentMonth.month - 1, 1);
  });
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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

  // 관리자 여부
  useEffect(() => {
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
  }, []);

  // currentMonth prop이 변경될 때 currentDate 동기화
  useEffect(() => {
    setCurrentDate(new Date(currentMonth.year, currentMonth.month - 1, 1));
  }, [currentMonth.year, currentMonth.month]);

  // 즐겨찾기 상태 가져오기
  useEffect(() => {
    if (isLoggedIn && nonAlwaysCalendars.length > 0) {
      const fetchFavoriteStatuses = async () => {
        const statuses: { [key: number]: { isFavorite: boolean; favoriteId?: number } } = {};

        for (const calendar of nonAlwaysCalendars) {
          try {
            const response = await getFavoriteStatus(calendar.clubId);
            statuses[calendar.clubId] = {
              isFavorite: response.isFavorite,
              favoriteId: response.favoriteId,
            };
          } catch (error) {
            console.error('즐겨찾기 상태 조회 실패:', error);
            statuses[calendar.clubId] = { isFavorite: false };
          }
        }

        setFavoriteStatuses(statuses);
      };

      fetchFavoriteStatuses();
    } else if (!isLoggedIn) {
      // 로그인하지 않은 경우 즐겨찾기 상태 초기화
      setFavoriteStatuses({});
    }
  }, [isLoggedIn, nonAlwaysCalendars]);

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

    // 부모 컴포넌트에 월 변경 알림 (API 호출을 위해)
    const newYear = newDate.getFullYear();
    const newMonth = newDate.getMonth() + 1;
    onMonthChange(newYear, newMonth);
  };

  if (!calendarData) {
    return <Loading />;
  }

  // 실제로 넘기는 건 calendarId
  const onClubClick = (calendarId: number) => {
    setIsCalendarModalOpen(true);
    setSelectedCalendarId(calendarId);
  };

  const onDateClick = (date: number, isCurrentMonth: boolean) => {
    if (isCurrentMonth) {
      const clickedDate = new Date(year, month - 1, date);
      setSelectedDate(clickedDate);
      setIsDateModalOpen(true);
      setTimeout(() => {
        setIsAnimating(true);
      }, 10);
    }
  };

  const handleDateClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsDateModalOpen(false);
    }, 300); // 애니메이션 완료 후 컴포넌트 제거
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

  const handleStarClick = async (clubId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // 동아리 클릭 이벤트 방지

    if (!isLoggedIn) {
      setModalMessage('로그인이 필요한 서비스 입니다.\n로그인 화면으로 이동하시겠습니까?');
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const currentStatus = favoriteStatuses[clubId];

      if (currentStatus?.isFavorite) {
        // 즐겨찾기 해제
        if (currentStatus.favoriteId) {
          await deleteFavorite(clubId, currentStatus.favoriteId);
        }

        // 즉시 UI 상태 업데이트
        setFavoriteStatuses((prev) => ({
          ...prev,
          [clubId]: {
            isFavorite: false,
            favoriteId: undefined,
          },
        }));

        setModalMessage('즐겨찾기가 해제되었습니다.');
        setIsModalOpen(true);
      } else {
        // 즐겨찾기 추가
        const response = await addFavorite(clubId);

        // 즉시 UI 상태 업데이트 (실제 favoriteId 사용)
        setFavoriteStatuses((prev) => ({
          ...prev,
          [clubId]: {
            isFavorite: true,
            favoriteId: response?.favoriteId ?? undefined,
          },
        }));

        setModalMessage('즐겨찾기에 추가되었습니다.');
        setIsModalOpen(true);
      }

      // 백그라운드 동기화 제거 - 이미 실제 favoriteId를 받아왔음
    } catch (error) {
      console.error('즐겨찾기 처리 중 오류:', error);
      setModalMessage('즐겨찾기 처리 중 오류가 발생했습니다.');
      setIsModalOpen(true);
    }
  };

  return (
    <div
      className="flex justify-center items-center bg-white md:bg-primary md:my-10 mt-0 md:rounded-lg border-y-[0.5px] border-[#0000000a] md:border-none"
      style={{
        boxShadow:
          '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      <div className="w-full">
        {/* 헤더 */}
        <div className="flex flex-row justify-between items-center w-full px-3 md:px-5">
          <div className="flex flex-row items-center mt-2 md:mt-0">
            <h1 className="md:text-white text-black pt-2 pb-1 md:py-6 pl-2 text-xl md:text-6xl font-semibold md:font-bold">
              {year}.{String(month).padStart(2, '0')}
            </h1>
            <div className="flex items-center md:ml-8 text-white">
              <Button
                variant="ghost"
                size="icon"
                className="md:text-white text-black hover:bg-white/20 py-4 gap-0"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="size-4 md:size-8 stroke-[2.5]" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="md:text-white text-black font-extrabold hover:bg-white/20 md:p-2 px-0 gap-0"
                onClick={() => changeMonth(+1)}
              >
                <ChevronRight className="size-4 md:size-8 stroke-[2.5]" />
              </Button>
            </div>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 px-4 gap-5 md:gap-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="md:text-white text-black text-sm md:text-base font-semibold md:font-bold p-2 text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-0 md:gap-1.5 px-4 md:p-4">
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

            // 그리드 위치에 따른 border 클래스 결정
            const colIndex = i % 7;
            const rowIndex = Math.floor(i / 7);
            const isLastRow = rowIndex === Math.floor((totalCells - 1) / 7);

            let borderClasses = '';
            if (colIndex < 6) {
              // 오른쪽 구분선 (마지막 열 제외)
              borderClasses += 'border-r-[0.5px] border-[#70707080]';
            }
            if (rowIndex === 0) {
              // 첫 번째 행의 위쪽 구분선
              borderClasses += ' border-t-[0.5px] border-[#70707080]';
            }
            if (!isLastRow) {
              // 아래쪽 구분선 (마지막 행 제외)
              borderClasses += ' border-b-[0.5px] border-[#70707080]';
            }

            return (
              <div
                key={i}
                className={`flex flex-col p-1.5 h-[90px] md:h-[110px] gap-0 hover:shadow-md scrollbar-hide ${borderClasses} ${
                  isCurrentMonth
                    ? 'bg-white hover:bg-white/80 transition-colors duration-300'
                    : 'bg-white/50'
                }`}
                onClick={() => onDateClick(date, isCurrentMonth)}
              >
                <div className="flex flex-col h-full">
                  <span
                    className={`text-sm text-center font-semibold md:font-medium  md:text-left md:text-base ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'} ${isToday ? 'flex items-center justify-center size-6 md:size-7 rounded-full bg-primary text-white mx-auto md:mx-0' : ''}`}
                  >
                    {displayDate}
                  </span>

                  {/* PC에서는 상세 정보 표시, 모바일에서는 개수만 표시 */}
                  <div className="hidden md:flex flex-col gap-1 overflow-y-auto scrollbar-hide flex-1">
                    {nonAlwaysCalendars.map((item) => {
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
                        <div key={item.calendarId} className="flex items-start gap-0.5 text-sm">
                          <div
                            onClick={() => onClubClick(item.calendarId)}
                            className="hover:scale-103 transition-all duration-300 hover:text-primary cursor-pointer flex-1 min-w-0 break-words"
                          >
                            <span className={`font-semibold ${textColor}`}>
                              {isStart ? '시작' : '마감'}
                            </span>
                            <span className="ml-1 break-words">{item.clubName}</span>
                          </div>
                          {!isAdmin && (
                            <Star
                              strokeWidth={2}
                              color="#FFD000"
                              fill={favoriteStatuses[item.clubId]?.isFavorite ? '#FFD000' : 'none'}
                              className="size-4 mt-0.5 cursor-pointer transition-all duration-200 hover:scale-110"
                              onClick={(e) => handleStarClick(item.clubId, e)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 모바일에서만 이벤트 개수 표시 */}
                  <div className="md:hidden flex flex-col gap-1 mt-auto justify-center">
                    {startEvents.length > 0 && (
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                          {startEvents.length}개
                        </span>
                      </div>
                    )}
                    {endEvents.length > 0 && (
                      <div className="flex items-center justify-center">
                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
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
              </div>
            );
          })}
        </div>
      </div>

      {/* 날짜 상세 모달 (모바일 전용) */}
      {isDateModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* 배경 오버레이 */}
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
              isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleDateClose}
          />

          {/* 날짜 상세 모달 */}
          <div className="flex items-end justify-center h-full">
            <div
              className={`w-full bg-white rounded-t-3xl p-6 transform transition-all duration-400 ease-out ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
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
                  onClick={handleDateClose}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-all duration-200 hover:scale-110 active:scale-95"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* 이벤트 목록 */}
              <div className="space-y-4">
                {(() => {
                  const { startEvents, endEvents } = getEventsForDate(
                    selectedDate.getDate(),
                    month
                  );

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
                                className="flex items-center justify-between p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all duration-300 hover:scale-103 hover:shadow-md transform hover:-translate-y-1"
                              >
                                <div className="flex-1">
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="font-medium text-gray-900">{item.clubName}</div>
                                    {!isAdmin && (
                                      <Star
                                        strokeWidth={2}
                                        color="#FFD000"
                                        fill={
                                          favoriteStatuses[item.clubId]?.isFavorite
                                            ? '#FFD000'
                                            : 'none'
                                        }
                                        className="size-4 mt-0.5 cursor-pointer transition-all duration-200 hover:scale-110"
                                        onClick={(e) => handleStarClick(item.clubId, e)}
                                      />
                                    )}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    {new Date(item.startAt).toLocaleDateString()} ~{' '}
                                    {new Date(item.endAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    onClubClick(item.calendarId);
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
                                className="flex items-center justify-between p-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-300 hover:scale-103 hover:shadow-md transform hover:-translate-y-1"
                              >
                                <div className="flex-1">
                                  <div className="flex flex-row items-center gap-2">
                                    <div className="font-medium text-gray-900">{item.clubName}</div>
                                    <Star
                                      strokeWidth={2}
                                      color="#FFD000"
                                      fill={
                                        favoriteStatuses[item.clubId]?.isFavorite
                                          ? '#FFD000'
                                          : 'none'
                                      }
                                      className="size-4 mt-0.5 cursor-pointer transition-all duration-200 hover:scale-110"
                                      onClick={(e) => handleStarClick(item.clubId, e)}
                                    />
                                  </div>
                                  <div className="text-xs text-red-600 mt-1">
                                    {new Date(item.endAt).toLocaleDateString()} ~{' '}
                                    {new Date(item.endAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    onClubClick(item.calendarId);
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
        </div>
      )}

      {/* 모달들 */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          message={modalMessage}
          onClose={() => setIsModalOpen(false)}
          onConfirm={() => {}}
          showConfirmButton={false}
        />
      )}

      {isCalendarModalOpen && (
        <CalendarModal
          clubId={selectedCalendarId}
          isOpen={isCalendarModalOpen}
          onClose={() => setIsCalendarModalOpen(false)}
          isAlways={false}
          month={month}
        />
      )}

      {isLoginModalOpen && (
        <Modal
          isOpen={isLoginModalOpen}
          message={modalMessage}
          onClose={() => setIsLoginModalOpen(false)}
          onConfirm={() => {
            router.push('/login');
          }}
          showConfirmButton={true}
        />
      )}
    </div>
  );
}
