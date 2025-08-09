import { getAccessToken } from '@/auth/AuthService';
import { apiClient } from '@/lib/apiClient';
import axios from 'axios';

//동아리 정보 불러오기
export const getClubInfo = async () => {
  try {
    const accessToken = getAccessToken();
    const res = await apiClient.get(`/v1/admins/mypage`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('res', res.data);
    if (res.data.success) {
      return res.data;
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
};

interface PatchClubInfoProps {
  imageKey: string;
  introduction: string;
  instagram: string;
  youtube: string;
  activity: string;
  leader: string;
  room: number | null;
}

//동아리 정보 수정
export const patchClubInfo = async ({
  imageKey,
  introduction,
  instagram,
  youtube,
  activity,
  leader,
  room,
}: PatchClubInfoProps) => {
  const accessToken = getAccessToken();
  try {
    const res = await apiClient.patch(
      `/v1/admins/change-page`,
      {
        imageKey: imageKey,
        introduction: introduction,
        instagram: instagram,
        youtube: youtube,
        activity: activity,
        leader: leader,
        room: room,
      },
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      }
    );
    if (res.data.success) {
      return res.data;
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
};

export interface PostImageFileProps {
  imageFileExtension: string;
  imageFile: File;
}

//동아리 로고 수정 시, presigned URL 가져오기
export const postImageFile = async ({ imageFileExtension, imageFile }: PostImageFileProps) => {
  const accessToken = getAccessToken();
  try {
    console.log('Uploading image with extension:', imageFileExtension);
    console.log('API URL:', `${apiClient.defaults.baseURL}/v1/images/club/logo`);
    
    // 먼저 올바른 엔드포인트인지 확인하기 위해 다른 이미지 업로드 API와 동일한 패턴 사용
    const res = await apiClient.post(
      `/v1/images/club/logo`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        params: {
          imageFileExtension: imageFileExtension,
        },
      }
    );
    
    console.log('Presigned URL response:', res.data);
    console.log('Image key:', res.data.data.imageKey);
    console.log('Image URL:', res.data.data.imageUrl);
    // console.log('Full response data:', JSON.stringify(res.data, null, 2));
    
    // 이미지 파일을 presigned URL로 업로드
    if (res.data.data.presignedUrl) {
      await axios.put(res.data.data.presignedUrl, imageFile, {
        headers: {
          'Content-Type': imageFile.type,
        },
      });
      console.log('Image uploaded successfully');
    }
    
    return res.data;
  } catch (error: any) {
    console.error('Error in postImageFile:', error);
    throw error;
  }
};
