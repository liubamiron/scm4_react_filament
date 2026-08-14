import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../api/client.ts'
import type { EventItem } from '../../../types'

export function useEvents() {
    return useQuery({
        queryKey: ['events'],
        queryFn: () => apiClient<EventItem[]>('/events'),
        staleTime: 1000 * 60 * 5,
    })
}

export function useEvent(slug: string) {
    return useQuery({
        queryKey: ['event', slug],
        queryFn: () => apiClient<EventItem>(`/events/${slug}`),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    })
}
