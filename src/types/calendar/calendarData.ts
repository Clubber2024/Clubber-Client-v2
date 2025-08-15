export interface CalendarResponse {
  data: {
    year: number;
    month: number;
    nonAlwaysCalendars: NonAlwaysCalendar[];
    alwaysCalendars: AlwaysCalendar[];
  };
}

export interface CalendarData {
  year: number;
  month: number;
  nonAlwaysCalendars: NonAlwaysCalendar[];
  alwaysCalendars: AlwaysCalendar[];
}

export interface NonAlwaysCalendar {
  clubId: number;
  clubName: string;
  recruitType: string;
  startAt: string;
  endAt: string;
}

export interface AlwaysCalendar {
  clubId: number;
  clubName: string;
  recruitType: string;
  calendarNum: number;
}

export interface CalendarClubResponse {
  success: boolean;
  timeStamp: number[];
  data: CalendarClubData;
}

export interface CalendarClubData {
  id: number;
  title: string;
  recruitType: string;
  startAt: string | null;
  endAt: string | null;
  createdAt: string;
  url: string;
  recruitStatus: string;
  writerRole: string;
}
