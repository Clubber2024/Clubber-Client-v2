import { apiClient } from "@/lib/apiClient";

 // 이메일 인증 api
 export const postUpdateEmail = async (email:string) => {
  try {

    const res = await apiClient.post(`/v1/admins/auths/me/update-email/send`, { email });
    
     return res.data;
    
  } catch {}
};

// 인증코드 확인 api
export const postUpdateCode = async ({email,authCode}:PatchUpdateEmailProps) => {
  try {
    // TODO: Replace with your actual API call
    const res = await apiClient.post(`/v1/admins/auths/me/update-email/verify`, { email:email, authCode: authCode });
   return res.data;
       // setIsVerifyCode(true); setAuthCode(emailCode); setIsNext(true); setEmailCodeMessage('인증되었습니다'); // mock
  } catch {
    // setIsVerifyCode(false);
    // setEmailCodeMessage('인증번호를 확인해주세요.');
  }
};

interface PatchUpdateEmailProps{
  email: string;
  authCode: string;
}

// 새 이메일 정보 update api
export const patchUpdateEmail = async ({email, authCode}:PatchUpdateEmailProps) => {
  try {
    // TODO: Replace with your actual API call
    const res = await apiClient.patch(`/v1/admins/me/email`, { email: email, authCode:authCode });
   return res.data;
    // setModalMessage('이메일이 변경되었습니다.'); setIsModalOpen(true); // mock
  } catch {}
};