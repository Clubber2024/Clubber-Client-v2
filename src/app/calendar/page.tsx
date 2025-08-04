import Calendar from '@/components/features/calendar/Calendar';
import RegularCalendar from '@/components/features/calendar/RegularCalendar';

export default function CalendarPage() {
  return (
    <div className="flex flex-row gap-4">
      <div className="flex-1">
        <RegularCalendar />
      </div>
      <div className="flex-3">
        <Calendar />
      </div>
    </div>
  );
}
