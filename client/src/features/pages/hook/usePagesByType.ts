import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../../api/client.ts';
import type { ServicePage } from "../../../types";

// Every CMS page of one `type` (the enum on the Page model), e.g. all pages
// filed under "Despre noi".
export function usePagesByType(type: ServicePage['type']) {
    return useQuery({
        queryKey: ['pages', 'type', type],
        queryFn: () => apiClient<ServicePage[]>(`/pages?type=${type}`),
        staleTime: 1000 * 60 * 5,
    });
}
