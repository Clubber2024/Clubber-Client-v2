import { apiClient } from '@/lib/apiClient';
import { ClubCardRes } from '@/types/club/clubCardData';

interface SearchResponse {
  success: boolean;
  data: {
    clubs: {
      [divisionName: string]: ClubCardRes[];
    };
  };
}

export const searchClub = async (params: {
    clubName?: string;
    hashtag?: string;
    division?: string;
    department?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params.clubName) searchParams.append('clubName', params.clubName);
    if (params.hashtag) searchParams.append('hashtag', params.hashtag);
    if (params.division) searchParams.append('division', params.division);
    if (params.department) searchParams.append('department', params.department);
  
    const response = await apiClient.get(`/v1/clubs?${searchParams.toString()}`);
    const data = response.data as SearchResponse;
    
    if (data.success && data.data.clubs) {
      // 모든 분과의 동아리들 하나의 배열로
      const allClubs: ClubCardRes[] = [];
      Object.values(data.data.clubs).forEach(divisionClubs => {
        allClubs.push(...divisionClubs);
      });
      return allClubs;
    }
    
    return [];
  };