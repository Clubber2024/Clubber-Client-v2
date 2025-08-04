import { Card } from '@/components/ui/card';

export default function MainCalendar() {
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dates = ['29', '30', '1', '2', '3', '4', '5'];
  const today = '1'; // 오늘 날짜 (화요일)

  return (
    <Card className="p-6 h-full">
      <h3 className="text-lg font-bold">오늘, 모집 마감!</h3>

      {/* 캘린더 섹션 */}
      <div>
        {/* 요일 행 */}
        <div className="grid grid-cols-7 gap-1 mb-0">
          {daysOfWeek.map((day, index) => (
            <div key={day} className="text-center">
              <div
                className={`pt-1 w-8 h-7 mx-auto flex items-center justify-center text-xs font-medium rounded-t-full ${
                  dates[index] === today ? 'bg-primary text-white' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            </div>
          ))}
        </div>

        {/* 날짜 행 */}
        <div className="grid grid-cols-7 gap-1">
          {dates.map((date) => (
            <div key={date} className="text-center">
              <div
                className={`pb-1 w-8 h-7 mx-auto flex items-center justify-center text-sm font-medium rounded-b-full ${
                  date === today ? 'bg-primary text-white' : 'text-gray-700'
                }`}
              >
                {date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-200 m-0"></div>

      {/* 리스트 아이템 */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span className="text-sm text-gray-700">클러버</span>
      </div>
    </Card>
  );
}
