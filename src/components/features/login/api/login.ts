import { getAccessToken, clearTokens } from '@/auth/AuthService';
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
    const res = await apiClient.post(`/v1/admins/logout`, {}, {
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
    console.error('Admin logout error:', error);
    clearTokens(); // Even if logout fails, clear tokens locally
    throw error;
  }
};

// 토큰 삭제는 AuthService.js에서 import하여 사용

//동아리 계정 회원탈퇴 
export const deleteWithdrawal = async () => {
  const accessToken = getAccessToken();
  try {
    const res = await apiClient.delete(`/v1/admins/withdraw`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (res.data.success) {
      clearTokens(); // 성공 시 토큰 클리어
      return res.data;
    } else {
      throw new Error('회원탈퇴 실패');
    }
  } catch (error) {
    console.error('Withdrawal error:', error);
    throw error;
  }
}
