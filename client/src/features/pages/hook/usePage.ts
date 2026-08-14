import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client.ts'

export interface Page {
    id: number
    slug: string
    title_ro: string
    content_ro: string
    title_ru?: string | null
    content_ru?: string | null
}

export function usePage(slug: string) {
    return useQuery({
        queryKey: ['page', slug],
        queryFn: () => apiClient<Page>(`/pages/${slug}`),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    })
}