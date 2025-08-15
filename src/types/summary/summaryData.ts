export interface SummaryResponse {
  success: boolean;
  timeStamp: number[];
  data: SummaryData[];
}

export interface SummaryData {
  division: string;
  clubs: SummaryClub[];
}

export interface SummaryClub {
  clubId: number;
  clubName: string;
}
