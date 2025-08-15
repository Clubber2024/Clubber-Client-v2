import { getAccessToken } from "@/auth/AuthService";
import { apiClient } from "@/lib/apiClient";

  // adminPrfrofil 불러오기기
  export const getAdminProfile = async () => {
    try {
      // const accessToken = getAccessToken();
      const res = await apiClient.get(`/v1/admins/me`, {
       
      });
     
     return res.data;
    } catch (error) {
    throw error;
    }
  };

  interface PatchAdminContactProps {
    instagram: string;
    etc: string;
  }

  // Update contact info
  export const patchAdminContact = async ({instagram, etc}:PatchAdminContactProps) => {
    try {
      // const accessToken = getAccessToken();
      const res = await apiClient.patch(
        `/v1/admins/me/contact`,
        {
          contact: {
            instagram: instagram,
            etc: etc,
          },
        },
        
      );
    return res.data;
    } catch (e) {
      
    }
  };