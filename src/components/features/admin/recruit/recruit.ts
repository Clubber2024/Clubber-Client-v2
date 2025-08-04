import { getAccessToken } from '@/auth/AuthService';
import { apiClient } from '@/lib/apiClient';
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
