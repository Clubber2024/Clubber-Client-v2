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