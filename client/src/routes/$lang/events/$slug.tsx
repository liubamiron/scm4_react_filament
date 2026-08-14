import { createFileRoute } from '@tanstack/react-router'
import { EventPage } from '../../../pages/EventPage.tsx'

export const Route = createFileRoute('/$lang/events/$slug')({
    component: EventPage,
})
