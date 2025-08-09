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

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
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
