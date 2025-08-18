import { apiClient } from '@/lib/apiClient';
import {
  CalendarResponse,
  CalendarClubResponse,
  AlwaysNextClubResponse,
} from '@/types/calendar/calendarData';

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

export const getAlwaysClubData = async (
  month: number,
  clubId: number,
  nowCalendarId?: number | null
) => {
  const response = await apiClient.post<AlwaysNextClubResponse>(`/v1/calendars/next-always`, {
    year: 2025,
    month,
    clubId,
    nowCalendarId,
  });
  return response.data;
};
