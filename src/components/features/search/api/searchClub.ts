import axios from 'axios';

export const searchClub = async (params: {
    clubName?: string;
    hashtag?: string;
    division?: string;
    department?: string;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params.clubName) searchParams.append('clubName', params.clubName);
    if (params.hashtag) searchParams.append('hashtag', params.hashtag);
    if (params.division) searchParams.append('division', params.division);
    if (params.department) searchParams.append('department', params.department);
  
    // const response = await apiClient.get(`/api/v1/clubs?${searchParams.toString()}`);
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/clubs?${searchParams.toString()}`);
    
    return response.data.data;
  };