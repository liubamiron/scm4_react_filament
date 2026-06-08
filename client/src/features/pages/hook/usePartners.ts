import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client.ts'
import type {Partner} from "../../../types";

export function usePartners() {
    return useQuery({
        queryKey: ['partners'],
        queryFn: () => apiClient<Partner[]>('/partners'),
        staleTime: 1000 * 60 * 5,
    })
}