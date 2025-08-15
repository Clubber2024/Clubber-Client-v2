import { apiClient } from '@/lib/apiClient';

export const getHashtag = async () => {
  const res = await apiClient.get('/v1/clubs/category/hashtags');
  return res.data.data;
};

export const getHashtagClubs = async (hashtag: string) => {
  const res = await apiClient.get(`/v1/clubs?hashtag=${hashtag}`);
  return res.data.data;
};
