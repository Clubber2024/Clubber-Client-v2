export interface HashtagData {
  code: string;
  title: string;
  imageUrl: string;
}

export interface HashtagClubsResponse {
  hashtag: string;
  clubs: HashtagClubsData[];
}

export interface HashtagClubsData {
  clubId: number;
  imageUrl: string;
  clubName: string;
  introduction: string;
  agreeToProvideInfo: boolean;
}
