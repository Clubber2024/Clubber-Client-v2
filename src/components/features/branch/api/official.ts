import { apiClient } from '@/lib/apiClient';

export const getOfficialList = async () => {
  const response = await apiClient.get('/v1/clubs/official');
  return response.data.data;
};
