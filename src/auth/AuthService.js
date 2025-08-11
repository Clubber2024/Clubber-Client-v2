// src/auth/AuthService.js
import { apiClient } from '@/lib/apiClient';

// 로컬 스토리지 키 설정
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const IS_ADMIN_KEY = 'isAdmin';

// 액세스 토큰 가져오기
// export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    // console.log("getAccessToken",localStorage.getItem(ACCESS_TOKEN_KEY));
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return null;
};

// 리프레시 토큰 가져오기
export const getRefreshToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return null;
};

// 관리자 여부 가져오기
// export const getIsAdmin = () => localStorage.getItem(IS_ADMIN_KEY);
export const getIsAdmin = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(IS_ADMIN_KEY) === 'true'; // 문자열이 아니라 Boolean을 반환
  }
  return false; // 서버 사이드에서는 기본값 false 반환
};

// 토큰 저장 -> isAdmin default value가 false였음 바보야
export const saveTokens = (accessToken, refreshToken, isAdmin) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(IS_ADMIN_KEY, isAdmin ? 'true' : 'false');
    // localStorage.setItem(IS_ADMIN_KEY, isAdmin);
  }
};

// 토큰 삭제 (로그아웃)
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(IS_ADMIN_KEY);
    localStorage.removeItem('isAdmin');
  }
};

let onAuthErrorCallback = null; // 콜백 함수 저장 변수

// 콜백 함수를 설정
export const setAuthErrorCallback = (callback) => {
  onAuthErrorCallback = callback;
};

// 액세스 토큰 갱신 요청
export const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    // if (!refreshToken) throw new Error('No refresh token available');
    if (!refreshToken) {
      console.log('No refresh token available - skipping token refresh');
      return null;
    }

    console.log('IsAdmin:', getIsAdmin());
    console.log('RefreshToken exists:', !!refreshToken);
    const isAdmin = getIsAdmin();
    const endpoint = getIsAdmin() ? `/v1/admins/refresh` : `/v1/auths/refresh`;
    console.log('Using endpoint:', endpoint);

    const response = await apiClient.post(
      endpoint,
      {},
      {
        headers: {
          refreshToken: refreshToken,
        },
      }
    );

    const { accessToken, refreshToken: newRefreshToken } = response.data.data;
    saveTokens(accessToken, newRefreshToken, isAdmin);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    clearTokens();
    if (error.response?.status === 403) {
      if (onAuthErrorCallback) {
        onAuthErrorCallback('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
      }
      // window.location.href = "/login"; // 로그인 페이지로 이동
    }
    return null;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    let token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 : 액세스 토큰이 만료되었을 때 자동 갱신
let isRefreshing = false;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh token이 없으면 토큰 갱신 시도 X
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        console.log('No refresh token - cannot refresh access token');
        return Promise.reject(error);
      }

      if (isRefreshing) return Promise.reject(error); // 무한 루프 방지

      isRefreshing = true;
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      isRefreshing = false;

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);
