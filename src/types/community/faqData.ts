export interface FaqResponse {
  success: boolean;
  timeStamp: number[];
  data: FaqItem[];
}

export interface FaqItem {
  code: string;
  title: string;
  answer: string;
}

export interface FaqParams {
  page?: number;
  size?: number;
}

