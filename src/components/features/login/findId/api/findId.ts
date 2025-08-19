import { apiClient } from '@/lib/apiClient';

export interface PostFindIdEmailProps {
  email: string;
  clubId: string;
}

//이메일 검증 api
export const postFindIdEmail = async ({ email, clubId }: PostFindIdEmailProps) => {
  console.log(email, clubId);
  try {
    const res = await apiClient.post(`/v1/admins/auths/find-username/send`, {
      clubId: clubId,
      email: email,
    });

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

export interface PostFindIdCodeProps extends PostFindIdEmailProps {
  authCode: string;
}

//인증번호 검증 api
export const postFindIdCode = async ({ email, clubId, authCode }: PostFindIdCodeProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/auths/find-username/verify`, {
      clubId: clubId,
      email: email,
      authCode: authCode,
    });

    return res.data;
  } catch (error: any) {
    // 서버에서 에러 응답을 보낸 경우 (400, 401 등)
    if (error.response && error.response.data) {
      return error.response.data;
    }
    // 네트워크 에러 등 기타 에러
    return { success: false, message: '네트워크 오류가 발생했습니다.' };
  }
};

//아이디 찾기 api
export const postFindId = async ({ email, clubId, authCode }: PostFindIdCodeProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/username/find`, {
      clubId: clubId,
      email: email,
      authCode: authCode,
    });

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};
