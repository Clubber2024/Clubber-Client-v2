import { getAccessToken } from '@/auth/AuthService';
import { apiClient } from '@/lib/apiClient';

export const getAdminsMe = async () => {
  const accessToken = getAccessToken();
  try {
    const res = await apiClient.get(`/v1/admins/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.data.success) {
      return res.data;
    } else {
      return;
    }
  } catch (error) {
    console.error('getAdminsMe error:', error);
    // console.error('Error response:', error.response?.data);
    // console.error('Error status:', error.response?.status);
    throw error;
  }
};
