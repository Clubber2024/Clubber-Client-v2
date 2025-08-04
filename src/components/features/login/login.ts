import { apiClient } from '@/lib/apiClient';

interface LoginResponse {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

// 관리자 로그인 핸들러
export const adminLoginHandler = async (
  adminId: string,
  adminPw: string
): Promise<LoginResponse> => {
  // if (!isId || !isPw) return;
  try {
    console.log('kk');
    const res = await apiClient.post(`/v1/admins/login`, {
      username: adminId,
      password: adminPw,
    });

    return res.data;
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error; // 또는 기본 값을 return하거나 throw
  }
};
