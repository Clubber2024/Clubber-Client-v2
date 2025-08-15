import { apiClient } from '@/lib/apiClient';
import { FavoriteClub, FavoriteResponse, UserFavoritesResponse } from '@/types/bookmark/bookmarkData';

//즐겨찾기 페이지 조회
export const getFavoritePage = async (page: number, size: number = 2): Promise<FavoriteResponse> => {
  const response = await apiClient.get('/v1/users/favorite/page', {
    params: { page, size }
  });
  
  return response.data.data;
};

//즐겨찾기 추가
export const addFavorite = async (clubId: number): Promise<void> => {
 
  
  await apiClient.post(`/v1/clubs/${clubId}/favorites`);
};

//즐겨찾기 삭제
export const deleteFavorite = async (clubId: number, favoriteId: number): Promise<void> => {   
  await apiClient.delete(`/v1/clubs/${clubId}/favorites/${favoriteId}`);
};


//즐겨찾기 전체 조회
export const getFavorites = async (): Promise<UserFavoritesResponse> => {
  const response = await apiClient.get('/v1/users/favorite');
  return response.data.data;
};

//회원 동아리 즐겨찾기 여부
export const getFavoriteStatus = async (clubId:number)=> {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await apiClient.get(`/v1/users/favorite/${clubId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  return response.data.data;
};