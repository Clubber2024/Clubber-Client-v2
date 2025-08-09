import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface MyCalendarProps {
  date: Date;
  onChange: (date: Date) => void;
}

const MyCalendar = ({ date, onChange }: MyCalendarProps) => {
  return <DayPicker mode="single" selected={date} onSelect={onChange} required={true} />;
};

export default MyCalendar;
