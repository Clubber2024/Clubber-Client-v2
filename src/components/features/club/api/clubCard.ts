import { apiClient } from '@/lib/apiClient';

export const getClubCard = async (clubCode: string, isCenter: boolean) => {
  try {
    const res = await apiClient.get(
      `/v1/clubs?${isCenter ? 'division' : 'department'}=${clubCode}`
    );
    return res.data.data;
  } catch (error) {
    console.error('Error fetching club card:', error);
    return [];
  }
};

//동아리 및 소모임 개별 페이지 조회
export const getClubInfomation = async (clubId: number) => {
  try {
    const res = await apiClient.get(`/v1/clubs/${clubId}`);
    return res.data.data;
  } catch (error) {
    console.error('Error fetching club info:', error);
    return null;
  }
};
