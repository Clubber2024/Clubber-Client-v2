import { apiClient } from '@/lib/apiClient';
import { CollegeResponse, College } from '@/types/branch/collegeData';

// 단과대 목록 조회
export const getColleges = async (): Promise<College[]> => {
  try {
    const response = await apiClient.get<CollegeResponse>(
      '/v1/clubs/category/colleges/with-departments'
    );
    return response.data.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};
