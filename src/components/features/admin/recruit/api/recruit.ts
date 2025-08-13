import { getAccessToken } from '@/auth/AuthService';
import { apiClient } from '@/lib/apiClient';
import axios from 'axios';
//모집글 리스트
interface RecruitListProps {
  content: RecruitContentProps[];
  hasNextPage: boolean;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
interface RecruitContentProps {
  recruitId: number;
  title: string;
  recruitType: string;
  statAt: string;
  endAt: string;
  content: string;
  applyLink: string;
  imageUrl: string;
}

export const getAdminRecruit = async (
  page: Number,
  pageSize: Number
): Promise<RecruitListProps> => {
  const accessToken = getAccessToken();

  const query = new URLSearchParams({
    page: page.toString(),
    size: pageSize.toString(),
  });
  const res = await apiClient.get(`/v1/admins/recruits?${query.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const data = res.data.data;
  console.log(data);
  return data;
};

interface UploadImagesProps {
  selectedFiles: File[];
}

//모집글 작성 이미지 업로드
export const uploadImages = async ({ selectedFiles }: UploadImagesProps) => {
  //선택된 파일 배열 확정
  // const filesToUpload = recruitId ? newAddedFiles.flat() : selectedFiles.flat();
  const accessToken = getAccessToken();

  const filesToUpload = selectedFiles.flat();

  // 파일 확장자 추출
  const extensions = filesToUpload.map((file: any) => file.name.split('.').pop().toUpperCase());

  try {
    const { data } = await apiClient.post(
      '/v1/images/club/recruit',
      { recruitImageExtensions: extensions },
      {
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      }
    );

    await Promise.all(
      data.data.map(async (fileData: any, index: number) => {
        // 파일 가져오기
        const file = selectedFiles.flat()[index];
        await axios.put(fileData.presignedUrl, file, {
          headers: { 'Content-Type': file.type },
        });
      })
    );
    // 업로드된 이미지 URL 반환
    return data.data.map((file: any) => file.imageKey);
  } catch (error) {
    console.error('이미지 업로드 실패:', error);
    throw error;
  }
};

interface HandleSubmitRecruitProps {
  title: string;
  content: string;
  imageKey: string;
  recruitType: string;
  startAt: string | null;
  endAt: string | null;
  applyLink: string;
  isCalendarLinked: boolean;
}

//모집글 작성 제출
export const handleSubmitRecruit = async ({
  title,
  content,
  imageKey,
  recruitType,
  startAt,
  endAt,
  applyLink,
  isCalendarLinked,
}: HandleSubmitRecruitProps) => {
  const accessToken = getAccessToken();

  const res = await apiClient.post(
    `/v1/admins/recruits`,
    {
      title: title,
      content: content,

      imageKey: imageKey,
      recruitType: recruitType,
      startAt: startAt,
      endAt: endAt,
      applyLink: applyLink,
      isCalendarLinked: isCalendarLinked,
    },
    {
      headers: {
        Authorization: ` Bearer ${accessToken}`,
      },
    }
  );

  return res.data;
};

export const getAdminRecruitContent = async (recruitId: string) => {
  try {
    const accessToken = getAccessToken();
    const res = await apiClient.get(`/v1/admins/recruits/${recruitId}`, {
      headers: {
        Authorization: ` Bearer ${accessToken}`,
      },
    });

    if (res.data.success) {
      return res.data.data;
    }
  } catch (error) {
    throw error;
  }
};

interface PatchAdminRecruitWriteProps extends Omit<HandleSubmitRecruitProps, 'imageKey'> {
  deletedImageUrls: string[];
  newImageKeys: string[];
  remainImageUrls: string[];
  images: string[];
}

//모집글 수정
export const patchAdminRecruitWrite = async (
  {
    title,
    content,
    recruitType,
    startAt,
    endAt,
    applyLink,
    isCalendarLinked,
    deletedImageUrls,
    newImageKeys,
    remainImageUrls,
    images,
  }: PatchAdminRecruitWriteProps,
  recruitId: string
) => {
  try {
    const res = await apiClient.patch(`/v1/admins/recruits/${recruitId}`, {
      title: title,
      content: content,
      recruitType: recruitType,
      startAt: startAt,
      endAt: endAt,
      applyLink: applyLink,
      isCalendarLinked: isCalendarLinked,
      deletedImageUrls: deletedImageUrls,
      newImageKeys: newImageKeys,
      remainImageUrls: remainImageUrls,
      images: images,
    });

    if (res.data.success) {
      
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

//모집글 삭제

export const deleteAdminRecruit = async (recruitId: number) => {
  try {
    const res = await apiClient.delete(`/v1/admins/recruits/${recruitId}`);

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

//모집글&캘린더 연동
export const linkCalendar = async (recruitId: string) => {
const accessToken = getAccessToken();
const currentDomain = typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_BASE_URL || '';
const recruitUrl = `${currentDomain}/admin/recruitContent?recruitId=${recruitId}`;

console.log('캘린더 연동 시도:', { recruitId: recruitId, recruitUrl });

const calendarRes = await apiClient.post(`/v1/admins/calendars/link`, {
  recruitId: recruitId,
  recruitUrl: recruitUrl
}, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  },
});
return calendarRes.data;

}