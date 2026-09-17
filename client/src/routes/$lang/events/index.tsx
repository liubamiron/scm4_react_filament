import { createFileRoute } from '@tanstack/react-router'
import { EventsPage } from '../../../pages/EventsPage.tsx'

// `?page=N` — pages are 1-based; anything unparsable falls back to page 1.
// Bounds against the actual number of pages are checked in the component,
// since the event count is only known once the query resolves.
export const Route = createFileRoute('/$lang/events/')({
    validateSearch: (search: Record<string, unknown>): { page?: number } => {
        const page = Number(search.page)
        return Number.isInteger(page) && page > 1 ? { page } : {}
    },
    component: EventsPage,
})
