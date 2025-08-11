export interface FavoriteClub {
  clubId: number;
  clubName: string;
  clubType: string;
  imageUrl: string;
  favoriteId: number;
}

export interface FavoriteResponse {
  content: FavoriteClub[];
  hasNextPage: boolean;
}
