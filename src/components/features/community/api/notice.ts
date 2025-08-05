import { apiClient } from '@/lib/apiClient';
import { NoticeResponse, NoticeParams } from '@/types/community/noticeData';

export const getNoticeListData = async (params: NoticeParams) => {
  const response = await apiClient.get<NoticeResponse>('/v1/notices', {
    params: params
  });
  
  return response.data;
};

export const getNoticeDetailData = async (noticeId: number) => {
  const response = await apiClient.get<NoticeResponse>(`/v1/notices/${noticeId}`);
  return response.data.data;
}