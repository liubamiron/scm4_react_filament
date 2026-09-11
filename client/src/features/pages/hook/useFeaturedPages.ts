import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client.ts';
import type {ServicePage} from "../../../types";

export function useFeaturedServices() {
    return useQuery({
        queryKey: ['pages', 'featured'],
        queryFn: () => apiClient<ServicePage[]>('/pages?featured=1'),
        staleTime: 1000 * 60 * 5,
    });
}
