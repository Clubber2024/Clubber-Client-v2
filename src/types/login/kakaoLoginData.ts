export interface KakaoLoginResponse {
  success: boolean;
  data: {
    userId: number;
    accessToken: string;
    refreshToken: string;
  };
}

export interface User {
  id: number;
  email: string;
}