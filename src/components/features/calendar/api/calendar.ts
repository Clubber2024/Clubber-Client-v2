interface CalendarResponse {
  year: number;
  month: number;
  nonAlwaysCalendars: NonAlwaysCalendar[];
  alwaysCalendars: AlwaysCalendar[];
}

interface NonAlwaysCalendar {
  clubId: number;
  clubName: string;
  recruitType: string;
  startAt: string;
  endAt: string;
}

interface AlwaysCalendar {
  clubId: number;
  clubName: string;
  recruitType: string;
  calendarNum: number;
}

export const getCalendarData = async (year: number, month: number): Promise<CalendarResponse> => {
  const response = await fetch(`/api/v1/calendars?year=${year}&month=${month}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch calendar data');
  }

  return response.json();
};