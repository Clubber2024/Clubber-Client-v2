import { apiClient } from '@/lib/apiClient';

export const getClubCard = async (divisionCode: string) => {
  try {
    const res = await apiClient.get(`/v1/clubs?division=${divisionCode}`);
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
}
