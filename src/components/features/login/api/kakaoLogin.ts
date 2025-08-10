import { apiClient } from '@/lib/apiClient';
import { KakaoLoginResponse } from '@/types/login/kakaoLoginData';
import { getAccessToken } from '@/auth/AuthService';

/**
 * 카카오 OAuth 코드로 로그인하여 토큰 받아오기
 * @param code 카카오에서 받은 인증 코드
 * @returns Promise<KakaoLoginResponse>
 */
export const kakaoLoginWithCode = async (code: string): Promise<KakaoLoginResponse> => {
  try {
    const response = await apiClient.get(`/v1/auths/oauth/kakao?code=${code}`);
    removeTokens()
    return response.data;
  } catch (error) {
    console.error('카카오 로그인 API 호출 실패:', error);
    removeTokens();
    throw error;
  }
};

export const kakaoLogout = async () => {
  const response = await apiClient.post(`/v1/auths/logout`);
  return response.data;
};

/**
 * 받아온 토큰 로컬 스토리지에 저장
 * @param accessToken 액세스 토큰
 * @param refreshToken 리프레시 토큰
 */
export const saveTokens = (accessToken: string, refreshToken: string): void => {
  try {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('토큰 저장 완료');
  } catch (error) {
    console.error('토큰 저장 실패:', error);
    throw error;
  }
};

/**
 * 로컬 스토리지에서 토큰 제거
 */
export const removeTokens = (): void => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('토큰 제거 완료');
  } catch (error) {
    console.error('토큰 제거 실패:', error);
    throw error;
  }
};

export const getUserInfo = async () => {
  const accessToken = getAccessToken();
  const response = await apiClient.get(`/v1/users/me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
