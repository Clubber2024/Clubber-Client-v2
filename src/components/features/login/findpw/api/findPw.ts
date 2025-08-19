import { apiClient } from '@/lib/apiClient';

interface PostFindPwEmailProps {
  username: string;
  email: string;
}

//이메일 검증 api
export const postFindPwEmail = async ({ username, email }: PostFindPwEmailProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/auths/reset-password/send`, {
      email: email,
      username: username,
    });

    
      return res.data;
    
  } catch (error:any) {
    if(error.response && error.response.data){
      return error.response.data;
    }
    return {success:false, message:'네트워크 오류가 발생했습니다.'};
  }
};

interface PostFindPwCodeProps {
  username: string;
  authCode: string;
}

//인증번호 검증 api
export const postFindPwCode = async ({ username, authCode }: PostFindPwCodeProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/auths/reset-password/verify`, {
      username: username,
      authCode: authCode,
    });

   
      return res.data;
  
  } catch (error:any) {
    if(error.response && error.response.data){
      return error.response.data;
    }
    return {success:false, message:'네트워크 오류가 발생했습니다.'};
  }
};

interface PatchResetPwProps extends PostFindPwCodeProps {
  password: string;
}

//비밀번호 재설정
export const patchResetPW = async ({ username, password, authCode }: PatchResetPwProps) => {
  try {
    const res = await apiClient.patch(`/v1/admins/password/reset`, {
      username: username,
      password: password,
      authCode: authCode,
    });

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};
