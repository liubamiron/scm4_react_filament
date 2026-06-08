import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client.ts'
import type {Transparency} from "../../../types";

export function useTransparency() {
    return useQuery({
        queryKey: ['transparency'],
        queryFn: () => apiClient<Transparency[]>('/transparency'),
        staleTime: 1000 * 60 * 5,
    })
}