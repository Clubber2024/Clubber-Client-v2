import { getAccessToken } from '@/auth/AuthService';
import { apiClient } from '@/lib/apiClient';

// interface LoginResponse {
//   accessToken: string;
//   refreshToken: string;
// }

interface LoginRequest {
  adminId: string;
  adminPw: string;
}

// 관리자 로그인 핸들러
export const adminLoginHandler = async ({ adminId, adminPw }: LoginRequest) => {
  // if (!isId || !isPw) return;
  try {
    const res = await apiClient.post(`/v1/admins/login`, {
      username: adminId,
      password: adminPw,
    });
    console.log('res', res.data);

    if (res.data.success) {
      console.log(res.data);
      return res.data;
    } else {
      throw new Error('로그인 실패');
    }
  } catch (error) {
    console.error('로그인 오류:', error);
    throw error;
  }
};

//동아리 계정 로그아웃
export const adminsLogout = async () => {
  const accessToken = getAccessToken();
  try {
    const res = await apiClient.post(`/v1/admins/logout`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    clearTokens();
    // if (res.data.success) {
    //   return res.data;
    // } else {
    //   return;
    // }
  } catch (error) {
    throw error;
  }
};

//토큰 삭제
export const clearTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('isAdmin');
};
