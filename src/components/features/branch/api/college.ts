import { apiClient } from '@/lib/apiClient';
import { CollegeResponse, DepartmentResponse } from '@/types/college/collegeData';

// 단과대 목록 조회
export const getColleges = async (): Promise<CollegeResponse> => {
  try {
    const response = await apiClient.get('/v1/clubs/category/colleges');
    return response.data;
  } catch (error) {
    console.error('Error fetching colleges:', error);
    throw error;
  }
};

// 단과대별 학과 목록 조회
export const getDepartments = async (collegeCode: string): Promise<DepartmentResponse> => {
  try {
    const response = await apiClient.get('/v1/clubs/category/departments', {
      params: { college: collegeCode },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
};
