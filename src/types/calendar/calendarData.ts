export interface CalendarResponse {
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