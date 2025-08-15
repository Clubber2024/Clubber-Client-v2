import { apiClient } from '@/lib/apiClient';
import { CalendarResponse, CalendarClubResponse } from '@/types/calendar/calendarData';

export const getCalendarData = async (year: number, month: number) => {
  const response = await apiClient.get<CalendarResponse>('/v1/calendars', {
    params: {
      year,
      month,
    },
  });

  return response.data.data;
};

export const getCalendarClubData = async (clubId: number) => {
  const response = await apiClient.get<CalendarClubResponse>(`/v1/calendars/${clubId}`);
  return response.data;
};
