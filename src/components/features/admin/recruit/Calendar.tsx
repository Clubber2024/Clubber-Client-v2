import { DayPicker } from 'react-day-picker';
import { ko } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface MyCalendarProps {
  date: Date;
  onChange: (date: Date) => void;
  minDate?: Date; // 최소 선택 가능한 날짜
}

const MyCalendar = ({ date, onChange, minDate }: MyCalendarProps) => {
  return (
    <DayPicker 
      mode="single" 
      selected={date} 
      onSelect={onChange} 
      required={true} 
      className='bg-white z-10 border px-4'
      disabled={minDate ? { before: minDate } : undefined}
      locale={ko}
    />
  );
};

export default MyCalendar;
