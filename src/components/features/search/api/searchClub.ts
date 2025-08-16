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

interface ClubTypes {
  clubs: {
    중앙동아리: ClubCardRes[];
    소모임: ClubCardRes[];
    공식단체: ClubCardRes[];
  };
}

export const searchClub = async (params: {
  clubName?: string;
  hashtag?: string;
  division?: string;
  department?: string;
}): Promise<ClubTypes> => {
  const searchParams = new URLSearchParams();

  if (params.clubName) searchParams.append('clubName', params.clubName);
  if (params.hashtag) searchParams.append('hashtag', params.hashtag);
  if (params.division) searchParams.append('division', params.division);
  if (params.department) searchParams.append('department', params.department);

  const response = await apiClient.get(`/v1/clubs?${searchParams.toString()}`);
  const data = response.data as SearchResponse;

  if (data.success && data.data.clubs) {
    // 분류 정보를 유지하여 반환
    const result: ClubTypes = {
      clubs: {
        중앙동아리: data.data.clubs.중앙동아리 || [],
        소모임: data.data.clubs.소모임 || [],
        공식단체: data.data.clubs.공식단체 || [],
      },
    };
    return result;
  }

  // 기본 빈 결과 반환
  return {
    clubs: {
      중앙동아리: [],
      소모임: [],
      공식단체: [],
    },
  };
};
