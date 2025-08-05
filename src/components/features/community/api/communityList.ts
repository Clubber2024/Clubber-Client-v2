import { apiClient } from "@/lib/apiClient";

export const getCommunityListData = async (tab: string, page: number, size: number, sort: string[]) => {
    const params = {}
    if (tab === 'notices') {
        params = {
            page,
            size,
            sort,
        }
    }

    const response = await apiClient.get(`/v1/${tab}`, {
        params: params
    });

    return response.data.data;
}