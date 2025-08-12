import { apiClient } from "@/lib/apiClient";

//홍보 게시판에서 모든 모집글 조회
export const getRecruitList = async (page: number, size: number) => {
  const res = await apiClient.get(`/v1/recruits?page=${page}&size=${size}`);
  if(res.data.success){
    return res.data.data;
  } else{
    console.error(res.data.message);
    return null;
  }
}

//홍보게시판에서 개별 모집글 조회
export const getRecruitData = async (recruitId: number) => {
  const res = await apiClient.get(`/v1/recruits/${recruitId}`);
  if(res.data.success){
    return res.data.data;
  } else{
    console.error(res.data.message);
    return null;
  }
}

//특정 동아리 모집글 조회
export const getClubRecruitList = async (clubId: number) => {
  const res = await apiClient.get(`/v1/clubs/${clubId}/recruit`);
  if(res.data.success){
    return res.data.data;
  } else{
    console.error(res.data.message);
    return null;
  }
}