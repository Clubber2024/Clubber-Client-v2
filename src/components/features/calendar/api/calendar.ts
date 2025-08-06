import { apiClient } from '@/lib/apiClient';
import { CalendarResponse } from '@/types/calendar/calendarData';

export const getCalendarData = async (year: number, month: number) => {
  const response = await apiClient.get<CalendarResponse>('/v1/calendars', {
    params: {
      year,
      month,
    },
  });
  
  return response.data.data;
};