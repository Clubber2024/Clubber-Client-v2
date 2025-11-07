export interface ReviewKeyword {
  reviewKeywordCategory: string;
  keywords: ReviewKeywordList[];
}

export interface ReviewKeywordList {
  code: string;
  title: string;
}
