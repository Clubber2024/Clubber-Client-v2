export interface NoticeResponse {
  content: Notice[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface Notice {
  noticeId: number;
  title: string;
  content: string;
  totalView: number;
  imageUrl: string;
  createdAt: string;
}

export interface NoticeParams {
  page: number;
  size: number;
  sort?: string[];
}