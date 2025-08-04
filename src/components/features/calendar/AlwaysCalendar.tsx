import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlwaysCalendar as AlwaysCalendarType } from '@/types/calendar/calendarData';

interface AlwaysCalendarProps {
  alwaysCalendars: AlwaysCalendarType[];
}

export default function AlwaysCalendar({ alwaysCalendars }: AlwaysCalendarProps) {
  return (
    <div className="h-full bg-primary p-4 rounded-lg">
      <Card className="bg-white p-6 rounded-none h-full">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-bold text-gray-900 mr-0.5">이달의 상시모집</h2>
          <div className="flex-1 h-px bg-gray-900 ml-2"></div>
        </div>

        {/* 동아리 목록 */}
        <div className="flex flex-col space-y-2">
          {alwaysCalendars.length > 0 ? (
            alwaysCalendars.map((calendar) => (
              <Button
                key={calendar.clubId}
                className="w-fit px-3 py-0.5 justify-start rounded-md transition-colors bg-secondary text-gray-800 hover:bg-primary/70"
              >
                {calendar.clubName}
              </Button>
            ))
          ) : (
            <div className="text-gray-500 text-sm">상시모집 동아리가 없습니다.</div>
          )}
        </div>
      </Card>
    </div>
  );
}
