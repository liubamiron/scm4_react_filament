import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client.ts'
import type { LawDocument } from '../../../types'

export function useLawDocuments() {
    return useQuery({
        queryKey: ['law-documents'],
        queryFn: () => apiClient<LawDocument[]>('/law-documents'),
        staleTime: 1000 * 60 * 5,
    })
}
