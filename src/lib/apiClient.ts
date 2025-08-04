import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
axios.defaults.withCredentials = true;

export const apiClient = axios.create({
  baseURL,
  withCredentials: true, // CORS 요청 시 쿠키 포함
});

apiClient.interceptors.request.use(
  function (config) {
    // 요청 전에 처리할 로직 (예: 토큰 첨부)
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    // 에러 핸들링
    return Promise.reject(error);
  }
);