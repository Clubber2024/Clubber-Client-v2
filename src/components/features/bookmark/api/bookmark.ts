import { apiClient } from '@/lib/apiClient';
import { FavoriteClub, FavoriteResponse } from '@/types/bookmark/bookmarkData';

export const getFavorites = async (page: number, size: number = 2): Promise<FavoriteResponse> => {
  const accessToken = localStorage.getItem('accessToken');
  
  const response = await apiClient.get('/v1/users/favorite/page', {
    params: { page, size },
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
  return response.data.data;
};

export const deleteFavorite = async (clubId: number, favoriteId: number): Promise<void> => {
  const accessToken = localStorage.getItem('accessToken');
  
  await apiClient.delete(`/v1/clubs/${clubId}/favorites/${favoriteId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
