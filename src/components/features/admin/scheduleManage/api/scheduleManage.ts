import { getAccessToken } from "@/auth/AuthService";
import { apiClient } from "@/lib/apiClient"
import { start } from "repl";

//캘린더 목록 조회
export const getCalendarList = async(page: Number, pageSize: Number, orderStatus?: string, calendarStatus?: string, recruitType?: string)=>{
  const accessToken = getAccessToken();
  const query = new URLSearchParams({
    page: page.toString(),
    size: pageSize.toString(),
  });

    // 정렬 파라미터 추가
    if (orderStatus) {
      query.append('sort', 'string');
      query.append('orderStatus', orderStatus);
    }

  // 필터 파라미터 추가
  if (calendarStatus) {
    query.append('calendarStatus', calendarStatus);
  }

  if (recruitType) {
    query.append('recruitType', recruitType);
  }
  

  
  const res = await apiClient.get(`/v1/admins/calendars?${query.toString()}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }) 
  return res.data;
}

//특정 캘린더 삭제
export const deleteCalendar = async(id: Number)=>{
  const accessToken = getAccessToken();
 
  const res = await apiClient.delete(`/v1/admins/calendars/${id}`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }) 
  return res.data;
}

export interface CalendarPros{
  id: number;
  title:string;
  recruitType: string;
  startAt: string | null;
  endAt: string | null;
  url: string;
}
//특정 캘린더 수정
export const patchCalendar = async({id, title, recruitType,startAt, endAt,url}:CalendarPros)=>{
  const accessToken = getAccessToken();
 
  const res = await apiClient.patch(`/v1/admins/calendars/${id}`,
    {
      title:title,
      recruitType:recruitType,
      startAt: recruitType==='ALWAYS'?null:startAt,
      endAt: recruitType==='ALWAYS'?null:endAt,
      url:url
    },{
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },}
  ) 
  return res.data;
}

export type PostCalendarProps = Omit<CalendarPros, 'id'|'url'> & {
  applyLink: string | null;
};

//미연동 캘린더 생성
export const postCalendar = async ({title,recruitType,startAt,endAt,applyLink}:PostCalendarProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/calendars`,{
      title: title,
      recruitType:recruitType,
      startAt: recruitType==='ALWAYS'?null:startAt,
      endAt:recruitType==='ALWAYS'?null:endAt,
      applyLink:applyLink
    });

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

interface PostCalendarDuplicateProps{
  recruitType: string;
  startAt: string;
}

//캘린더 중복 여부 확인
export const postCalendarDuplicate = async ({recruitType,startAt}:PostCalendarDuplicateProps) => {
  try {
    const res = await apiClient.post(`/v1/admins/calendars/duplicate`,{
    
      recruitType:recruitType,
      startAt:startAt,
      
    });

    if (res.data.success) {
      return res.data;
    }
  } catch (error) {
    throw error;
  }
};

//특정 캘린더 조회
export const getCalendar = async(id:number)=>{
  try{
    const res= await apiClient.get(`/v1/admins/calendars/${id}`)

    if(res.data.success){
      return res.data;
    } 
  }catch(error){
    throw error;
  }
}

//특정 캘린더 연동 해제
export const deletedCalendarLink= async(id:number)=>{
  const accessToken = getAccessToken();
  const res = await apiClient.patch(`/v1/admins/calendars/link/${id}/unlink`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  return res.data;
}