import { apiClient } from '@/lib/apiClient';

// 메인 페이지 모집글 조회
export const getMainRecruitList = async () => {
  const res = await apiClient.get('/v1/recruits/main-page');
  if (res.data.success) {
    return res.data.data;
  } else {
    console.error(res.data.message);
    return null;
  }
};

// 메인 페이지 조회수 조회
export const getMainPopularClubs = async () => {
  const res = await apiClient.get('/v1/clubs/popular');
  if (res.data.success) {
    return res.data.data;
  } else {
    console.error(res.data.message);
    return null;
  }
};

// 메인 페이지 캘린더 조회
export const getMainCalendar = async () => {
  const res = await apiClient.get('/v1/calendars/today');
  if (res.data.success) {
    return res.data.data;
  } else {
    console.error(res.data.message);
    return null;
  }
};

// 메인 페이지 공지사항 조회
export const getMainNotice = async () => {
  const res = await apiClient.get('/v1/notices/main-page');
  if (res.data.success) {
    return res.data.data;
  } else {
    console.error(res.data.message);
    return null;
  }
};

// 메인 페이지 faq 조회
// export const getMainFaq = async () => {
//   const res = await apiClient.get('/v1/faqs/main-page');
//   if (res.data.success) {
//     return res.data.data;
//   } else {
//     console.error(res.data.message);
//     return null;
//   }
// }
